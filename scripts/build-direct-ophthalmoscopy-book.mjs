import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { pages } from "../public/js/directOphthalmoscopyBookData.js";

const root = fileURLToPath(
  new URL("../public/images/pdf/Workshop/DO/", import.meta.url),
);
const out = path.join(root, "mobile");
await mkdir(out, { recursive: true });
const temporary = await mkdtemp(path.join(tmpdir(), "direct-book-"));
const prefix = path.join(temporary, "sheet");
try {
  execFileSync(
    process.env.PDFTOPPM_PATH || "pdftoppm",
    [
      "-f",
      "1",
      "-l",
      "1",
      "-singlefile",
      "-scale-to-x",
      "6000",
      "-scale-to-y",
      "-1",
      "-png",
      path.join(root, "DO.pdf"),
      prefix,
    ],
    { windowsHide: true },
  );
  const buffer = await readFile(prefix + ".png");
  const { width, height } = await sharp(buffer).metadata();
  for (const { panels } of pages) {
    for (const [id, , box] of panels) {
      const [left, top, right, bottom] = box.map((n, i) =>
        Math.round(n * (i % 2 ? height / 1698 : width / 1200)),
      );
      await sharp(buffer)
        .extract({ left, top, width: right - left, height: bottom - top })
        .webp({ lossless: true })
        .toFile(path.join(out, id + "-hd.webp"));
    }
  }
} finally {
  await unlink(prefix + ".png").catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await rmdir(temporary);
}
