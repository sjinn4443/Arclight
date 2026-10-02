import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "photo-file-store.js"), "utf8");

function createHarness() {
  const created = [];
  const revoked = [];
  const urlApi = {
    createObjectURL(file) {
      const value = `blob:${file.name}`;
      created.push(value);
      return value;
    },
    revokeObjectURL(value) {
      revoked.push(value);
    },
  };
  const window = {};
  vm.runInNewContext(source, { window, globalThis: window });
  const store = window.ALLAN_PHOTO_FILE_STORE.createPhotoFileStore({ urlApi });
  return { created, revoked, store };
}

test("photo files retain their original File-like objects and replace object URLs safely", () => {
  const { created, revoked, store } = createHarness();
  const first = { name: "first.jpg", type: "image/jpeg", size: 1024 };
  const second = { name: "second.webp", type: "image/webp", size: 2048 };

  assert.equal(store.replace("limb", first), "blob:first.jpg");
  assert.equal(store.getFile("limb"), first);
  assert.equal(store.replace("limb", second), "blob:second.webp");
  assert.equal(store.getFile("limb"), second);
  assert.deepEqual(created, ["blob:first.jpg", "blob:second.webp"]);
  assert.deepEqual(revoked, ["blob:first.jpg"]);
});

test("clearing revokes active URLs and restores neutral state", () => {
  const { revoked, store } = createHarness();
  store.replace("limb", { name: "limb.png", type: "image/png", size: 1024 });
  store.replace("close", { name: "close.jpg", type: "image/jpeg", size: 1024 });

  store.clear();

  assert.equal(store.getFile("limb"), null);
  assert.equal(store.getFile("close"), null);
  assert.equal(store.getObjectUrl("limb"), "");
  assert.deepEqual(revoked, ["blob:limb.png", "blob:close.jpg"]);
});

test("validation preserves the established image type and size rules", () => {
  const { store } = createHarness();
  assert.equal(store.validate({ type: "image/png", size: 1024 }), "");
  assert.equal(
    store.validate({ type: "image/gif", size: 1024 }),
    "Use a JPEG, PNG or WebP image.",
  );
  assert.equal(
    store.validate({ type: "image/jpeg", size: 12 * 1024 * 1024 + 1 }),
    "Image is too large. Use a file under 12 MB.",
  );
});

test("empty images are rejected and failed replacement preserves the previous file", () => {
  const window = {};
  vm.runInNewContext(source, { window, globalThis: window });
  const revoked = [];
  const store = window.ALLAN_PHOTO_FILE_STORE.createPhotoFileStore({
    urlApi: {
      createObjectURL(file) {
        if (file.name === "bad") throw new Error("allocation failed");
        return "blob:good";
      },
      revokeObjectURL(url) {
        revoked.push(url);
      },
    },
  });
  assert.match(store.validate({ size: 0, type: "image/png" }), /empty/);
  const first = { name: "good", size: 1, type: "image/png" };
  store.replace("close", first);
  assert.throws(
    () => store.replace("close", { name: "bad" }),
    /allocation failed/,
  );
  assert.equal(store.getFile("close"), first);
  assert.equal(store.getObjectUrl("close"), "blob:good");
  assert.deepEqual(revoked, []);
});
