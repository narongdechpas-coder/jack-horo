# Image Asset Manifest: Cosmic Neon Redesign

ภาพประกอบของงาน redesign ตามสเปก *Horoscope Hub — Cosmic Neon Design Standard* (§5–7)
**สถานะ: ภาพครบแล้วและใช้งานอยู่ในเว็บ** (ได้รับจากเจ้าของโปรเจกต์ แปลงด้วย `scripts/prepare-site-images.mjs` ขนาดจริงของแต่ละภาพอยู่ใน `src/lib/art-manifest.json`)

**ข้อสังเกต:** ภาพต้นฉบับเล็กกว่าที่ขอไว้ (hero กว้าง 1672px แทน 2400px, ภาพอื่น 1086–1448px) สคริปต์จึงไม่ขยายภาพเกินขนาดจริง ถ้าต้องการให้คมขึ้นบนจอใหญ่ ให้สร้างภาพใหม่ที่ความละเอียดสูงขึ้น แล้วรันสคริปต์ซ้ำ

**วิธีส่งภาพ (กรณีสร้างใหม่)**
- PNG หรือ JPG ภาพละ 1 ไฟล์ ตั้งชื่อตาม ID เช่น `IMG-02.png`
- ความกว้างอย่างน้อย 1600px (ภาพ hero อย่างน้อย 2400px)
- ห้ามมีตัวหนังสือ โลโก้ หรือลายน้ำในภาพ ข้อความทั้งหมดจะเขียนด้วย HTML
- ระหว่างทำงาน ผมจะแปลงเป็น WebP หลายขนาดด้วย `scripts/prepare-site-images.mjs` แล้วเก็บไว้ที่ `public/art/` ไฟล์ต้นฉบับจะไม่ขึ้น repo

| ID | ตำแหน่ง | สถานะ | สัดส่วน | พื้นหลัง | ครอปบนมือถือ / จอกว้าง | ไฟล์ปลายทาง |
|---|---|---|---|---|---|---|
| IMG-01 | Hero หน้าแรก (จอกว้าง ≥ 768px) | DONE | 16:9 | ทึบ | `object-fit: cover` ข้อความวางทางซ้าย | `public/art/hero-wide-*.webp` |
| IMG-01M | Hero หน้าแรก (มือถือ < 768px) | DONE | 4:5 | ทึบ | ข้อความวางครึ่งล่าง | `public/art/hero-tall-*.webp` |
| IMG-02 | การ์ด เลข 7 ตัว | DONE | 4:3 | ทึบ | มือถือครอปเป็นสี่เหลี่ยมจัตุรัสตรงกลาง | `public/art/cat-thai-seven-*.webp` |
| IMG-03 | การ์ด ไพ่ป๊อก | DONE | 4:3 | ทึบ | เหมือนข้างบน | `public/art/cat-playing-cards-*.webp` |
| IMG-04 | การ์ด ไพ่ยิปซี | DONE | 4:3 | ทึบ | เหมือนข้างบน | `public/art/cat-tarot-*.webp` |
| IMG-05 | การ์ด ตำราพยากรณ์นโปเลียน | DONE | 4:3 | ทึบ | เหมือนข้างบน | `public/art/cat-oraculum-*.webp` |
| IMG-06 | การ์ด ปาจื้อ | DONE | 4:3 | ทึบ | เหมือนข้างบน | `public/art/cat-bazi-*.webp` |
| IMG-08 | การ์ดและแบนเนอร์ 12 ราศี | DONE | 4:3 | ทึบ | เหมือนการ์ดอื่น | `public/art/cat-zodiac-*.webp` |
| IMG-09 | การ์ดและแบนเนอร์อี้จิง | DONE | 4:3 | ทึบ | เหมือนการ์ดอื่น | `public/art/cat-iching-*.webp` |
| IMG-10 | การ์ดและแบนเนอร์เลขศาสตร์ | DONE | 4:3 | ทึบ | เหมือนการ์ดอื่น | `public/art/cat-numerology-*.webp` |
| IMG-07 | ดวงวันนี้ตามวันเกิด | DONE | 3:4 | ทึบ | มือถือแสดงเป็นแถบด้านบน | `public/art/daily-*.webp` |
| IMG-08 | ไพ่ประจำวัน | EXISTING | 300×527 | — | — | ใช้ภาพ Rider-Waite ของไพ่ที่สุ่มได้จริง `public/tarot/<id>.webp` |
| — | ดาว เนบิวลา พื้นหลัง ไอคอน | CSS/SVG | — | — | — | ทำด้วย CSS และ SVG ไม่ต้องใช้ภาพ |

**ข้อแตกต่างจากสเปกต้นฉบับ (เจ้าของโปรเจกต์อนุมัติแล้ว)**
- **IMG-05:** ศาสตร์ที่เว็บมีจริงคือ *ตำราพยากรณ์นโปเลียน* (Oraculum ศาสตร์ตะวันตก) ไม่ใช่ "โป๊ยเซียน" ที่เป็นศาสตร์จีน จึงเปลี่ยนภาพเป็นแนวตำราโบราณแทนหยินหยาง
- **IMG-07:** เว็บไม่มีระบบ 12 ราศี จึงไม่ใช้ภาพแกะราศีเมษ เปลี่ยนเป็นภาพดาวประจำวันทั้ง 8 ของไทย ให้ตรงกับระบบ "ดวงวันนี้ตามวันเกิด" ที่ใช้หลักทักษา
- **IMG-08:** ใช้ภาพไพ่จริงของไพ่ประจำวัน เพื่อให้ชื่อไพ่ตรงกับภาพเสมอ ตามที่สเปกกำหนด

---

## Prompts (คัดลอกไปใช้ได้ทั้งก้อน ใส่ Base Style ไว้ท้ายทุกอันแล้ว)

### IMG-01: Hero (16:9)
```
Create a wide 16:9 cinematic hero illustration for a modern astrology website called Horoscope Hub. A luminous celestial zodiac wheel floats above distant midnight mountains, with a crescent moon, deep-space nebulae, fine constellations, subtle shooting stars, and a small contemplative human silhouette looking toward the cosmos. Use deep navy and indigo as dominant colors, with controlled neon purple, electric blue, and magenta highlights. Elegant, mysterious, youthful, premium digital artwork. Keep the central-left area visually quiet for overlaying a large headline and CTA buttons. Place the brightest focal elements toward the right side. No text, no letters, no logos, no watermarks. High detail, polished composition, suitable for a responsive website hero.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-01M: Hero มือถือ (4:5 แนวตั้ง)
```
Create a vertical 4:5 cinematic hero illustration for a modern astrology website called Horoscope Hub, designed for mobile screens. In the upper half, a luminous celestial zodiac wheel and a crescent moon float among deep-space nebulae, fine constellations, and subtle shooting stars. In the lower half, calm, dark midnight sky above distant mountain silhouettes, with a small contemplative human silhouette on a ridge looking up. Keep the entire lower half visually quiet and dark for overlaying a large headline and two buttons. Deep navy and indigo dominant, with controlled neon purple, electric blue, and magenta highlights. Elegant, mysterious, youthful, premium digital artwork. No text, no letters, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### สไตล์การ์ดศาสตร์: Gold Line Celestial (ใช้ตั้งแต่ ต.ค. 2569)

ภาพการ์ดชุดแรกมีรายละเอียดเต็มเฟรมทุกภาพ พอวางรวมกันในหน้าแรกจึงดูรก ชุดปัจจุบันจึงใช้ลายเส้นทองบนพื้นน้ำเงินเข้มเหมือนกันทุกภาพ วัตถุหลักชิ้นเดียวไม่เกิน 40% ของภาพ และต่างกันแค่แสงเรืองจาง ๆ ด้านหลังที่เป็นสีประจำศาสตร์ ภาพชุดเดิมยังเก็บไว้นอก repo ถ้าจะย้อนกลับ ให้รันสคริปต์กับไฟล์ต้นฉบับเดิม

### IMG-02: เลข 7 ตัว (4:3)
```
Minimalist luxury line-art illustration, 4:3. The Roman numeral "VII" in a tall, elegant classical serif (like letters engraved on an ancient Roman monument), drawn only with thin glowing gold double-line strokes, with fine serifs and delicate engraved detailing. It is centered inside a fine circular orbit line with seven small gold four-pointed stars evenly spaced around it. The whole design sits in the center of a flat deep midnight-navy background (#0B1230), with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, with generous empty space around it. Only gold linework on navy, plus a faint electric-blue glow (#38BDF8) behind the numeral. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. The only characters are the three letters V, I, I, spelled correctly as "VII". No other text, no Arabic numerals, no watermark, no extra objects, no landscape.
```

### IMG-08: 12 ราศี (4:3)
```
Minimalist luxury line-art illustration, 4:3. A simple zodiac wheel drawn only with thin glowing gold lines: two concentric circles divided into twelve segments, each segment marked by a tiny constellation of dots, with a small radiant sun at the center, centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint warm orange glow (#FB923C) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no zodiac glyphs, no letters, no watermark, no extra objects, no landscape.
```

### IMG-10: เลขศาสตร์ (4:3)
```
Minimalist luxury line-art illustration, 4:3. A golden-ratio spiral drawn with thin glowing gold lines at the center, surrounded by the digits 1 to 9 in small elegant gold numerals placed evenly on a fine circle and connected by delicate geometric lines forming a nine-pointed star, centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint teal glow (#2DD4BF) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. Only the digits 1–9, no words, no letters, no watermark, no extra objects, no landscape.
```

### IMG-03: ไพ่ป๊อก (4:3)
```
Minimalist luxury line-art illustration, 4:3. A neat fan of three playing cards drawn only with thin glowing gold lines, showing a spade, a heart and a club symbol, one on each card, centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint magenta-pink glow (#EC4899) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no letters, no numbers, no watermark, no extra objects, no landscape.
```

### IMG-04: ไพ่ยิปซี (4:3)
```
Minimalist luxury line-art illustration, 4:3. A single fan of three tarot cards drawn only with thin, elegant glowing gold lines (fine engraving-style linework, a small sun on the middle card, a crescent moon and a star on the side cards), centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint purple glow (#A855F7) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no letters, no watermark, no extra objects, no landscape.
```

### IMG-05: ตำราพยากรณ์นโปเลียน (4:3)
```
Minimalist luxury line-art illustration, 4:3. An open antique book drawn only with thin glowing gold lines, with five horizontal rows of small gold dots (single and paired dots) rising gently from its pages like starlight, and a delicate laurel wreath outline above, centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint cyan glow (#67E8F9) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no letters, no numbers, no watermark, no extra objects, no landscape.
```

### IMG-06: ปาจื้อ (4:3)
```
Minimalist luxury line-art illustration, 4:3. Four slender pillars standing side by side, drawn only with thin glowing gold lines, beneath a small yin-yang symbol inside a fine octagon (eight trigram outline), centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint warm amber-gold glow (#FBBF24) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no Chinese characters, no letters, no watermark, no extra objects, no landscape.
```

### IMG-09: อี้จิง (4:3)
```
Minimalist luxury line-art illustration, 4:3. Six horizontal lines stacked as an I Ching hexagram (some solid, some broken in the middle) drawn with thin glowing gold lines, with three round ancient coins with square holes below them, also in gold line-art, centered on a flat deep midnight-navy background (#0B1230) with a very subtle soft vignette and a few tiny gold star dots. The subject fills no more than 40% of the frame, generous empty space around it. Only gold linework on navy, plus a faint jade-green glow (#34D399) behind the subject. Clean, calm, premium, cohesive icon-like composition, like a luxury book cover. No text, no Chinese characters, no letters, no watermark, no extra objects, no landscape.
```
### IMG-07: ดวงวันนี้ตามวันเกิด (3:4 แนวตั้ง)
```
Create a 3:4 vertical Cosmic Neon illustration representing the Thai astrological week: eight luminous celestial orbs (the sun, the moon, and six planets) arranged in a graceful circular orbit around a softly glowing center, connected by fine golden constellation lines, above a calm midnight horizon with subtle Thai-inspired ornamental light patterns. Deep navy and indigo with neon purple, electric blue, and restrained starlight-gold accents. Elegant, calm, mature, premium editorial artwork. Strong centered composition with clear separation from the background. No text, no numbers, no zodiac glyphs, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```
