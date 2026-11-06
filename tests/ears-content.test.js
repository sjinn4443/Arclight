import { describe, expect, it } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  EAR_TOPICS,
  EAR_LESSONS,
  EAR_CATALOG,
  EAR_LESSON_PARENTS,
} from "../public/js/earsContentData.js";
import { ROUTES } from "../public/js/config.js";
import distribution from "../scripts/package-distribution.cjs";

const root = path.resolve("public");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "data/ears-assets.json"), "utf8"),
);
const asset = (url) => path.join(root, url.replace(/^\//, ""));

describe("Ears source curriculum", () => {
  it("packages source documents as optional content instead of app-shell downloads", () => {
    expect(distribution.isPackAsset("/documents/ears/who-manual.pdf")).toBe(
      true,
    );
    expect(distribution.isPackAsset("/documents/ears/ears.pptx")).toBe(true);
    expect(distribution.isPackAsset("/documents/ears/website-ent.docx")).toBe(
      true,
    );
    expect(distribution.isPackAsset("/data/ears-assets.json")).toBe(false);
  });
  it("gives every topic and lesson a reachable route and parent", () => {
    const catalogRoutes = Object.values(EAR_CATALOG).flat();
    expect(new Set(catalogRoutes).size).toBe(catalogRoutes.length);
    expect(catalogRoutes).toContain("primaryEarCareWorkshop");
    Object.entries(EAR_TOPICS).forEach(([route, topic]) => {
      expect(catalogRoutes).toContain(route);
      expect(ROUTES[route]).toBe("html/earsContent.html");
      expect(fs.existsSync(asset(topic.image))).toBe(true);
      topic.groups.forEach((group) =>
        group.lessons.forEach((id) => {
          expect(EAR_LESSONS[id]).toBeDefined();
          expect(EAR_LESSON_PARENTS[id]).toBe(route);
        }),
      );
    });
    Object.keys(EAR_LESSONS).forEach((id) => {
      expect(EAR_LESSON_PARENTS[id]).toBeDefined();
      expect(ROUTES[id]).toBe("html/earsContent.html");
    });
  });

  it("keeps the original PDFs byte-for-byte and provides every rendered page", () => {
    Object.values(manifest.documents).forEach((doc) => {
      const original = manifest.sources.find(
        (source) => source.file === doc.source,
      );
      const digest = createHash("sha256")
        .update(fs.readFileSync(asset(doc.pdf)))
        .digest("hex");
      expect(digest).toBe(original.sha256);
      doc.pages.forEach((url) =>
        expect(fs.statSync(asset(url)).size).toBeGreaterThan(0),
      );
    });
    expect(
      Object.values(manifest.documents).reduce(
        (count, doc) => count + doc.pages.length,
        0,
      ),
    ).toBe(228);
  });

  it("retains the complete source practicals and valid page ranges", () => {
    expect(EAR_LESSONS.earsWashout.pages).toEqual([52, 53, 54]);
    expect(EAR_LESSONS.earsDryMopping.pages).toEqual([55, 56]);
    expect(EAR_LESSONS.earsEarDrops.pages).toEqual([57, 58]);
    Object.values(EAR_LESSONS)
      .filter((lesson) => lesson.type === "pdf")
      .forEach((lesson) => {
        const source = manifest.documents[lesson.asset];
        expect(source).toBeDefined();
        (lesson.pages || []).forEach((number) =>
          expect(source.pages[number - 1]).toBeDefined(),
        );
      });
  });

  it("deduplicates the OSCE recording and does not label still slides as videos", () => {
    expect(manifest.sources).toHaveLength(26);
    const duplicates = manifest.sources.filter((source) => source.duplicateOf);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].sha256).toBe(
      manifest.sources.find(
        (source) => source.file === duplicates[0].duplicateOf,
      ).sha256,
    );
    expect(Object.keys(manifest.videos)).toHaveLength(3);
    expect(EAR_LESSONS.earsTympanicBasics.type).toBe("diagram");
    expect(EAR_LESSONS.earsTympanicDetailed.type).toBe("diagram");
    Object.values(manifest.videos).forEach((sources) => {
      [sources.low, sources.high].forEach((url) =>
        expect(fs.statSync(asset(url)).size).toBeGreaterThan(0),
      );
    });
  });

  it("keeps source graphics, landmark diagrams and original teaching downloads available", () => {
    Object.values(EAR_LESSONS).forEach((lesson) => {
      if (lesson.type === "download")
        expect(fs.statSync(asset(lesson.asset)).size).toBeGreaterThan(0);
      if (lesson.type === "scroll")
        lesson.sections.forEach((section) => {
          if (section.image)
            expect(fs.existsSync(asset(section.image))).toBe(true);
        });
      if (lesson.type === "diagram")
        manifest.decks[lesson.asset].forEach((url) => {
          expect(fs.readFileSync(asset(url), "utf8")).toContain(
            "data:image/webp;base64,",
          );
        });
    });
  });
});
