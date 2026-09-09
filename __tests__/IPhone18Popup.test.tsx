/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import IPhone18Popup from "../app/components/IPhone18Popup";

beforeEach(() => {
  sessionStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

async function openPopup() {
  render(<IPhone18Popup />);
  await act(async () => { jest.advanceTimersByTime(800); });
}

describe("IPhone18Popup — منطق sessionStorage", () => {

  test("1. Session جديدة → Popup تظهر", async () => {
    await openPopup();
    expect(screen.getByText("iPhone 18")).toBeInTheDocument();
  });

  test("2. popup_shown تُسجَّل في sessionStorage فور الظهور (قبل الإغلاق)", async () => {
    await openPopup();
    expect(sessionStorage.getItem("popup_shown")).toBe("true");
  });

  test("3. Refresh (remount بدون مسح sessionStorage) → لا تظهر", async () => {
    const { unmount } = render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    unmount();

    render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    expect(screen.queryByText("iPhone 18")).not.toBeInTheDocument();
  });

  test("4. Refresh عدة مرات → لا تظهر", async () => {
    const { unmount: u1 } = render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    u1();

    for (let i = 0; i < 3; i++) {
      const { unmount } = render(<IPhone18Popup />);
      await act(async () => { jest.advanceTimersByTime(800); });
      expect(screen.queryByText("iPhone 18")).not.toBeInTheDocument();
      unmount();
    }
  });

  test("5. إغلاق الـ Popup بزرار ✕ → تختفي", async () => {
    await openPopup();

    const closeBtn = screen.getByLabelText("إغلاق");
    await act(async () => {
      fireEvent.click(closeBtn);
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByText("iPhone 18")).not.toBeInTheDocument();
  });

  test("6. بعد الإغلاق — remount → لا تظهر", async () => {
    const { unmount } = render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });

    const closeBtn = screen.getByLabelText("إغلاق");
    await act(async () => {
      fireEvent.click(closeBtn);
      jest.advanceTimersByTime(400);
    });
    unmount();

    render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    expect(screen.queryByText("iPhone 18")).not.toBeInTheDocument();
  });

  test("7. النقر على الـ backdrop يغلق الـ Popup", async () => {
    const { container } = render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });

    const backdrop = container.firstChild as HTMLElement;
    await act(async () => {
      fireEvent.click(backdrop);
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByText("iPhone 18")).not.toBeInTheDocument();
  });

  test("8. زرار CTA يوجّه لـ /smartphones/iphone-18", async () => {
    await openPopup();
    const cta = screen.getByText("كن من الأوائل — اعرف التفاصيل");
    expect(cta.closest("a")).toHaveAttribute("href", "/smartphones/iphone-18");
  });

  test("9. Session جديدة (مسح sessionStorage) → تظهر مرة أخرى", async () => {
    const { unmount } = render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    expect(sessionStorage.getItem("popup_shown")).toBe("true");
    unmount();

    // محاكاة إغلاق المتصفح → session جديدة
    sessionStorage.clear();

    render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });
    expect(screen.getByText("iPhone 18")).toBeInTheDocument();
    expect(sessionStorage.getItem("popup_shown")).toBe("true");
  });

  test("10. popup_shown لا تُكتب إذا كانت موجودة مسبقاً", async () => {
    sessionStorage.setItem("popup_shown", "true");
    const spy = jest.spyOn(Storage.prototype, "setItem");

    render(<IPhone18Popup />);
    await act(async () => { jest.advanceTimersByTime(800); });

    expect(spy).not.toHaveBeenCalledWith("popup_shown", expect.anything());
    spy.mockRestore();
  });

});
