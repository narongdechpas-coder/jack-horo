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

### IMG-09: อี้จิง (4:3)
```
Create a 4:3 Cosmic Neon illustration for "I Ching – the Chinese Book of Changes". Three ancient bronze Chinese coins with square holes float and spin in mid-air above an open bamboo-slip scroll, leaving trails of light. Above them, six glowing horizontal lines (some solid, some broken in the middle) stack upward like a luminous hexagram made of starlight, surrounded by a faint circle of the eight trigrams and a softly glowing yin-yang at the center of the sky. Misty jade-green mountains and drifting clouds below in a classical Chinese ink-painting mood. Deep navy and indigo dominant, with controlled neon jade-green and electric blue light, subtle purple, and restrained antique-gold highlights on the coins. Keep the composition centered with dark space at top and bottom so it can be cropped into a wide banner. Elegant, mysterious, premium editorial digital painting. No text, no letters, no Chinese characters, no numbers, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-08: 12 ราศี (4:3)
```
Create a 4:3 Cosmic Neon illustration for "Western Astrology – the 12 zodiac signs". A luminous circular zodiac wheel floats in deep space, its twelve segments marked only by small glowing constellation patterns (no glyphs, no letters). Inside the wheel, a softly glowing golden sun and a silver crescent moon sit side by side, connected by fine lines of starlight. Around the wheel, faint planetary orbits with a few small glowing planets. Deep navy and indigo dominant, with controlled neon purple, electric blue and magenta light, and restrained starlight-gold accents. Keep the wheel centered with generous dark space at the top and bottom, because the image will also be cropped into a wide horizontal banner. Elegant, mysterious, premium editorial digital painting. No text, no letters, no zodiac symbols, no numbers, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-02: เลข 7 ตัว (4:3)
```
Create a 4:3 Cosmic Neon illustration representing Thai numerology and the traditional seven-number divination system. Show a large luminous number seven surrounded by seven subtle numbered celestial nodes, fine geometric connections, concentric astronomical circles, and a midnight star field. Deep navy background with electric blue and neon purple illumination, restrained magenta accents. Mystical, intelligent, structured, culturally respectful, premium digital artwork. Clear central focal point, balanced composition, no readable Thai text, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-03: ไพ่ป๊อก (4:3)
```
Create a 4:3 premium Cosmic Neon illustration for standard playing-card divination. Show three elegant playing cards with recognizable traditional spade, heart, and club suit symbols, floating above a deep midnight-blue cosmic surface. Add subtle violet nebulae, electric-blue rim lighting, small stars, and controlled magenta reflections. Keep the card faces recognizable and uncluttered. Modern mystical editorial illustration, polished materials, strong focal hierarchy. No text beyond standard suit symbols, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-04: ไพ่ยิปซี (4:3)
```
Create a 4:3 premium Cosmic Neon illustration inspired by the Rider-Waite tarot tradition. Show a small fan of richly illustrated tarot cards featuring recognizable celestial motifs, a radiant sun, a crescent moon, and stars. Use deep navy, indigo, electric blue, neon purple, and restrained magenta. Ornate but legible card borders, luminous atmospheric lighting, sophisticated mystical mood, clean focal hierarchy. Do not imitate a specific copyrighted card image exactly; create original tarot-inspired artwork. No additional text, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-05: ตำราพยากรณ์นโปเลียน (4:3)
```
Create a 4:3 Cosmic Neon illustration for "Napoleon's Oraculum", a Western divination book in which a person draws five rows of marks to reveal a symbol. An antique leather-bound book lies open on a midnight-navy cosmic surface. Five horizontal rows of luminous dots (single and paired dots, like geomantic figures) rise from its pages as glowing starlight. Add a faint laurel-wreath motif, a quill, and elegant astronomical engravings around it. Deep navy and indigo with controlled electric-blue and cosmic-cyan light and restrained antique-gold highlights. Mysterious, scholarly, premium editorial digital painting. Clear central focal point. No readable text, no letters, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-06: ปาจื้อ (4:3)
```
Create a 4:3 sophisticated illustration representing BaZi, the Chinese Four Pillars of Destiny. Depict a luminous eight-trigram-inspired circular arrangement, four balanced vertical pillars represented by elegant geometric columns, subtle five-element symbolism, and delicate Chinese cloud patterns against a midnight navy cosmic background. Use restrained antique gold, electric blue, and subtle violet light. The mood is analytical, balanced, mystical, and premium. Ensure symbols are deliberate and culturally respectful. Do not generate random Chinese characters or pseudo-text. No logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```

### IMG-07: ดวงวันนี้ตามวันเกิด (3:4 แนวตั้ง)
```
Create a 3:4 vertical Cosmic Neon illustration representing the Thai astrological week: eight luminous celestial orbs (the sun, the moon, and six planets) arranged in a graceful circular orbit around a softly glowing center, connected by fine golden constellation lines, above a calm midnight horizon with subtle Thai-inspired ornamental light patterns. Deep navy and indigo with neon purple, electric blue, and restrained starlight-gold accents. Elegant, calm, mature, premium editorial artwork. Strong centered composition with clear separation from the background. No text, no numbers, no zodiac glyphs, no logos, no watermarks.

Style: Cosmic Neon digital illustration, deep midnight navy and indigo environment, controlled neon purple and electric blue illumination, subtle magenta highlights, celestial dust, elegant astronomical geometry, sophisticated mystical atmosphere, high-quality editorial artwork, clean focal hierarchy, refined lighting, polished digital painting, visually cohesive with a modern premium astrology platform.
```
