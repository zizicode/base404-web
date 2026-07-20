import sharp from "sharp";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const source = join(publicDir, "android-chrome-512x512.png");

const trimmed = await sharp(source).trim({ threshold: 20 }).png().toBuffer();

const outputs = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
];

for (const [filename, size] of outputs) {
  await sharp(trimmed).resize(size, size).png().toFile(join(publicDir, filename));
  console.log(`Generated ${filename} (${size}x${size})`);
}

await sharp(trimmed).resize(32, 32).png().toFile(join(publicDir, "favicon.ico"));
console.log("Generated favicon.ico (32x32 PNG)");
