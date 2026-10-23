# ✦ Horoscope Hub

รวมศาสตร์ดูดวงจากไทย ตะวันตก และจีน ไว้ในที่เดียว ทำงานในเบราว์เซอร์ทั้งหมด **ไม่ต้องใช้ API key และไม่ต้องมี server**

| ศาสตร์ | สถานะ |
| --- | --- |
| 🇹🇭 เลข 7 ตัว (ทักษา 4 ฐาน) | ✅ ใช้งานได้ |
| 🃏 ไพ่ป๊อก 52 ใบ (ไพ่ประจำวัน / อดีต-ปัจจุบัน-อนาคต) | ✅ ใช้งานได้ |
| 🔮 ไพ่ยิปซี (Tarot) Rider-Waite 78 ใบ (1 / 3 / ความรัก 5 / Celtic Cross 10 ใบ) | ✅ ใช้งานได้ |
| 📜 ตำราพยากรณ์นโปเลียน (Oraculum) 32 คำถาม 32 คำพยากรณ์ | ✅ ใช้งานได้ |
| 🀄 ปาจื้อ (Bazi) สี่เสา ธาตุทั้งห้า วัยจร 10 ปี | ✅ ใช้งานได้ |

## เริ่มใช้งาน

```bash
npm install
npm run dev        # เปิด http://localhost:3000
```

คำสั่งอื่น ๆ

```bash
npm test           # unit tests (Vitest)
npm run lint       # ตรวจ type ด้วย TypeScript
npm run build      # สร้างเว็บแบบ static ไว้ที่โฟลเดอร์ out/
npm start          # เปิดเว็บจาก out/
```

โฟลเดอร์ `out/` เป็นไฟล์ static ล้วน นำไปวางบน GitHub Pages, Netlify หรือ Vercel ได้ทันที

### Deploy

ทุกครั้งที่ push ขึ้น `main` ระบบจะรันเทสต์ build แล้วเผยแพร่ไปที่ branch `gh-pages` อัตโนมัติ เว็บจะออนไลน์ที่ https://narongdechpas-coder.github.io/jack-horo/

ถ้าจะ deploy ใต้ path อื่น ให้ตั้ง `NEXT_PUBLIC_BASE_PATH` (เช่น `/jack-horo`) ตอน build

## หมอดู AI (ถามต่อจากผลดวง)

หน้าผลของทุกศาสตร์มีปุ่ม "🔮 ถามหมอดูต่อ" ให้ Claude (`claude-sonnet-5-5`) อธิบายผลดวงที่แสดงอยู่และตอบคำถามเพิ่ม

- ทำงานเฉพาะบน **Netlify** ผ่าน function `netlify/functions/fortune-chat.mts` เพราะ API key ต้องอยู่ฝั่ง server
- บน GitHub Pages ไม่มี server ปุ่มแชทจึงซ่อนไว้ ส่วนอื่นใช้งานได้ปกติ
- **ตั้งค่า:** Netlify → Site configuration → Environment variables → เพิ่ม `ANTHROPIC_API_KEY` (สร้างได้ที่ console.anthropic.com) แล้ว deploy ใหม่
- **ค่าใช้จ่าย:** ราว 0.3 บาทต่อคำถาม แนะนำให้ตั้ง monthly spend limit ใน Anthropic Console
- โค้ด: `src/lib/chat/` (prompt, ตัวแปลงผลดวงเป็นข้อความ, ตัวตรวจคำขอ, handler) และ `src/components/FortuneChat.tsx`

## ดีไซน์ (Cosmic Neon)

- **โทนสี:** อยู่ใน `src/app/globals.css` มีโหมดมืดและสว่าง ทุกคู่สีตัวอักษรกับพื้นผ่าน WCAG AA
  - ปุ่มใช้ `.btn-primary` / `.btn-secondary`
  - ข้อความสีม่วงใช้ `--accent-text`
  - สีนีออน `--neon-*` ใช้เฉพาะเส้นขอบและแสงเรือง
- **ปุ่มสลับธีม:** จำค่าไว้ใน localStorage (`theme`) และมีสคริปต์ใน `<head>` กันจอกะพริบ
- **หน้าแรก:** `src/components/home/`
  - Hero
  - การ์ด 5 ศาสตร์ (อ่านจาก `src/lib/systems/registry.ts`)
  - ดวงวันนี้ตามวันเกิด (หลักทักษา `src/lib/systems/daily/taksa.ts`)
  - ไพ่ประจำวัน (seed จากวันที่)
- **ภาพประกอบ:** `public/art/` สร้างจากภาพต้นฉบับด้วย `node scripts/prepare-site-images.mjs <โฟลเดอร์ภาพ>` รายการภาพและ prompt อยู่ที่ `docs/design/image-assets.md`

## หลักการทำงาน

- **โค้ดคำนวณดวง** ด้วยฟังก์ชันที่ให้ผลเหมือนเดิมทุกครั้งและมีเทสต์ครอบคลุม
- **คำทำนาย** มาจากกฎและข้อความที่เขียนไว้ล่วงหน้า (`meanings.ts`, `deck.ts`) จึงไม่ต้องเรียก AI
- **แชร์ผลได้ด้วยลิงก์** วันเกิดหรือ seed ของไพ่เก็บอยู่ใน URL คนที่เปิดลิงก์จะเห็นผลเดียวกัน

### ปาจื้อ (Bazi)
- คำนวณสี่เสาด้วย [lunar-typescript](https://github.com/6tail/lunar-typescript) (MIT)
- เสาปีและเสาเดือนเปลี่ยนตามสารทจีน จึงแปลงเวลาไทยเป็นเวลาปักกิ่ง (+1 ชม.) ปีเปลี่ยนที่ลี่ชุน
- เสาวันและเสาชั่วโมงใช้เวลาสุริยะของกรุงเทพฯ (ช้ากว่านาฬิกาไทยราว 18 นาที)
- กำลังดวง: นับอักษรที่เป็นธาตุเดียวกับตัวเราหรือธาตุที่ให้กำเนิด โดยกิ่งเดือนมีน้ำหนัก 2 เท่า ถ้าได้ ≥ 50% ถือว่าดวงแข็ง ซึ่งเป็นวิธีแบบย่อ

### เลข 7 ตัว
1. แปลงวันเกิดเป็นวันทางจันทรคติไทยด้วยอัลกอริทึมสุริยยาตร (หรคุณ อวมาน ดิถี) รองรับปีอธิกมาส (8-8) และปีอธิกวาร
2. วันเริ่มเมื่อพระอาทิตย์ขึ้น (06:00) และวันพุธหลัง 18:00 นับเป็นราหู
3. แถว 1/2/3 เริ่มจากเลขวัน (อาทิตย์ = 1) เดือนจันทรคติ และปีนักษัตร (ชวด = 1) ตามลำดับ เลขที่เกิน 7 ให้ลบ 7 ออก แล้วนับเพิ่มทีละหนึ่งจนครบ 7 หลัก ส่วนแถว 4 คือผลรวมของแต่ละหลัก

## โครงสร้าง

```
src/
  app/                       # หน้าเว็บ (Next.js App Router, static export)
  components/
  lib/systems/
    registry.ts              # รายชื่อศาสตร์ทั้งหมด
    thai-seven/              # thai-lunar.ts, calculate.ts, meanings.ts + tests
    playing-cards/           # deck.ts, draw.ts, spreads.ts + tests
    tarot/                   # deck.ts (ความหมายไทย 78 ใบ), spreads.ts + tests
    bazi/                    # names.ts, calculate.ts + tests
    oraculum/                # data.ts (คำถามและคำพยากรณ์), oracle.ts + tests
  lib/random.ts              # PRNG แบบใส่ seed ใช้ร่วมกันทุกศาสตร์ไพ่
public/tarot/                # ภาพไพ่ยิปซี (WebP)
scripts/prepare-tarot-images.mjs
```

**เพิ่มศาสตร์ใหม่:** สร้าง `lib/systems/<id>/` และ `app/<id>/` แล้วเปลี่ยนรายการใน `registry.ts` เป็น `available: true`

## เครดิต

`thai-lunar.ts` พอร์ตมาจาก [KranaxALT/thailunar](https://github.com/KranaxALT/thailunar) (MIT) ซึ่งพอร์ตมาจาก [pythaidate](https://github.com/hmmbug/pythaidate) โดย Mark Hollow (MIT) อีกต่อหนึ่ง ผลลัพธ์ตรงกับ pythaidate ทุกวันตั้งแต่ ค.ศ. 1900–2100

ภาพไพ่ยิปซีเป็นสำรับ Rider-Waite ต้นฉบับปี 1909 (public domain) นำมาจากแพ็กเกจ [@cometpisces/tarot-kit-images](https://www.npmjs.com/package/@cometpisces/tarot-kit-images) แล้วแปลงเป็น WebP ด้วย `npm run tarot:images`

> คำทำนายทั้งหมดเพื่อความบันเทิง
