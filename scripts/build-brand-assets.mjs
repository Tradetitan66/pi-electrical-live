/**
 * Brand asset build.
 *
 * Run with: npm run assets
 *
 * WHY A SCRIPT INSTEAD OF HAND-MADE FILES
 * ----------------------------------------
 * The supplied artwork (PI LOGO.png / PI MARK.png) is a 3-channel RGB PNG with
 * a solid #000000 background and NO alpha channel. The black rectangle is
 * baked into the pixels, so it cannot be removed without altering the logo
 * itself - which is exactly what the client asked us not to do.
 *
 * That single fact drives every decision in this file:
 *
 *  1. The header and footer use a TYPOGRAPHIC wordmark instead of the artwork,
 *     because a black box in a light header looks broken. See components/
 *     Wordmark.tsx - dropping in a transparent logo later is a one-line change
 *     in data/business.ts.
 *
 *  2. The favicon and social card use the real artwork on a #000000 field, so
 *     the baked-in background disappears into the page. This script pins the
 *     canvas colour to #000000 rather than the site's #0b0d0c for that reason.
 *
 * Everything here is derived from the source files, so regenerating is
 * idempotent and the outputs can be rebuilt at any time.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const img = (...parts) => join(root, "public", "images", ...parts);
const publicDir = join(root, "public");

/** Matches the artwork's background exactly, so the box is invisible. */
const ARTWORK_BLACK = "#000000";
const GREEN = "#6DD491";
const GREEN_STRONG = "#45C97E";
const MUTED_DARK = "#A7AEA8";
const WARM = "#F7F7F3";

const SANS = "Helvetica Neue, Helvetica, Arial, sans-serif";

/** Minimal ICO container wrapping a single 32x32 PNG. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width  (0 would mean 256; ours is 32)
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette size
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12); // offset: 6 + 16

  return Buffer.concat([header, entry, png]);
}

async function icons() {
  const mark = await readFile(img("mark.png"));

  const sizes = [
    [32, "icon-32.png"],
    [180, "apple-icon.png"],
    [192, "icon-192.png"],
    [512, "icon-512.png"],
  ];

  for (const [size, name] of sizes) {
    // The artwork is already a black square, so a straight resize is correct.
    await sharp(mark)
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(img(name));
    console.log(`  images/${name}  ${size}x${size}`);
  }

  const png32 = await sharp(mark)
    .resize(32, 32, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(join(publicDir, "favicon.ico"), icoFromPng(png32, 32));
  console.log("  favicon.ico       32x32");
}

/**
 * Social sharing card, 1200x630.
 *
 * Uses the real mark on a #000000 field plus set type. The green is used as a
 * FILL/heading accent on black (10.65:1) and all body copy uses the light
 * muted token, which scores 8.60:1 there.
 *
 * No domain is printed: the production domain is still unconfirmed, and
 * printing a placeholder would be worse than printing nothing.
 */
async function socialCard() {
  const mark = await readFile(img("mark.png"));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${ARTWORK_BLACK}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${GREEN}"/>
  <text x="540" y="248" font-family="${SANS}" font-size="82" font-weight="800" letter-spacing="-3" fill="${WARM}">PI <tspan fill="${GREEN}">Electrical</tspan></text>
  <rect x="540" y="284" width="120" height="5" fill="${GREEN_STRONG}"/>
  <text x="540" y="352" font-family="${SANS}" font-size="31" font-weight="600" fill="${MUTED_DARK}">Fully qualified electrician</text>
  <text x="540" y="404" font-family="${SANS}" font-size="31" font-weight="600" fill="${GREEN}">Edinburgh &#183; The Lothians &#183; Fife</text>
  <text x="540" y="466" font-family="${SANS}" font-size="26" font-weight="500" fill="${MUTED_DARK}">Domestic &#183; Commercial &#183; Emergency</text>
  <text x="540" y="540" font-family="${SANS}" font-size="24" font-weight="500" fill="${MUTED_DARK}">Free, no-obligation quotes</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: await sharp(mark).resize(360, 360).png().toBuffer(), left: 110, top: 135 }])
    .png({ compressionLevel: 9 })
    .toFile(join(publicDir, "opengraph-image.png"));

  console.log("  opengraph-image.png  1200x630");
}

await mkdir(img(), { recursive: true });
console.log("Building brand assets...");
await icons();
await socialCard();
console.log("Done.");
