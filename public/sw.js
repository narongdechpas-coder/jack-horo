// Service worker ของ Horoscope Hub: ทำให้ติดตั้งเป็นแอปได้ และเปิดหน้าที่เคยดูได้ตอนออฟไลน์
// - หน้าเว็บ: ดึงจากเน็ตก่อนเสมอ (เห็นของใหม่ทุก deploy) ถ้าออฟไลน์ค่อยใช้ของที่เก็บไว้
// - ไฟล์ที่ชื่อไม่เปลี่ยนเนื้อหา (_next/static, ภาพ, ไอคอน): ใช้ของที่เก็บไว้ก่อน
// - แชท AI และคำขอที่ไม่ใช่ GET: ไม่ยุ่ง

const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname; // "/" หรือ "/jack-horo/"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.add(SCOPE))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isAsset = (path) =>
  path.startsWith(`${SCOPE}_next/static/`) ||
  path.startsWith(`${SCOPE}art/`) ||
  path.startsWith(`${SCOPE}tarot/`) ||
  /\/icon-\d+\.png$|\/(icon\.svg|apple-icon\.png)$/.test(path);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.includes("/.netlify/")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(url.pathname, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(url.pathname, { cacheName: PAGES })
            .then((hit) => hit || caches.match(SCOPE, { cacheName: PAGES }))
            .then((hit) => hit || Response.error()),
        ),
    );
    return;
  }

  if (isAsset(url.pathname)) {
    event.respondWith(
      caches.open(ASSETS).then((c) =>
        c.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              if (res.ok) c.put(req, res.clone());
              return res;
            }),
        ),
      ),
    );
  }
});
