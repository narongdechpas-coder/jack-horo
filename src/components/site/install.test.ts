import { describe, expect, it } from "vitest";
import { detectMode } from "./install";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const LINE = IPHONE.replace("Safari/604.1", "Safari Line/14.10.0");
const FACEBOOK = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36 [FBAN/EMA;FBLC/th_TH;FBAV/400.0]";
const ANDROID_CHROME = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

describe("detectMode", () => {
  it("hides the install option when already opened from the home screen", () => {
    expect(detectMode(IPHONE, true, false)).toBe("installed");
  });

  it("asks chat-app browsers to open the site in Safari/Chrome first", () => {
    expect(detectMode(LINE, false, false)).toBe("inapp");
    expect(detectMode(FACEBOOK, false, false)).toBe("inapp");
  });

  it("shows Add to Home Screen steps on iPhone and iPad", () => {
    expect(detectMode(IPHONE, false, false)).toBe("ios");
    expect(detectMode(MAC, false, true)).toBe("ios"); // iPadOS reports itself as a Mac
  });

  it("waits for the browser's own install prompt elsewhere", () => {
    expect(detectMode(ANDROID_CHROME, false, false)).toBe("unsupported");
    expect(detectMode(MAC, false, false)).toBe("unsupported");
  });
});
