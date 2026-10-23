import Anthropic from "@anthropic-ai/sdk";
import { createChatHandler } from "../../src/lib/chat/handler";

// อ่าน key จาก environment variable ที่ตั้งไว้ในหน้า Netlify (ไม่อยู่ในโค้ด)
export default createChatHandler(() =>
  process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null,
);
