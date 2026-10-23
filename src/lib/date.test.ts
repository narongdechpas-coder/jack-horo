import { describe, expect, it } from "vitest";
import { isFutureDate, todayISO } from "./date";

describe("todayISO", () => {
  it("formats the local date with zero padding", () => {
    expect(todayISO(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});

describe("isFutureDate", () => {
  const now = new Date(2026, 9, 23, 10, 0);
  it("allows today and past dates", () => {
    expect(isFutureDate("2026-10-23", now)).toBe(false);
    expect(isFutureDate("1990-08-15", now)).toBe(false);
  });
  it("rejects tomorrow and later", () => {
    expect(isFutureDate("2026-10-24", now)).toBe(true);
    expect(isFutureDate("2027-01-01", now)).toBe(true);
  });
});
