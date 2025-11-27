/** @jest-environment node */

/**
 * Accessibility (ARIA) regression test
 * - Crawls all HTML files under the `public` directory
 * - Ensures interactive elements have accessible names
 * - Ensures non-native clickable elements define role + tabindex
 * - Ensures modals/dialogs have proper ARIA
 *
 * Tweak SELECTORS / RULES to match your real classnames if needed.
 */

const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { JSDOM } = require("jsdom");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Native interactive tags (don’t require explicit role)
const NATIVE_INTERACTIVE = new Set([
  "BUTTON",
  "A",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "SUMMARY",
]);

// Heuristics for “clickable but not native”
// Adjust to your app’s patterns if needed
const CLICKABLE_SELECTORS = [
  "[onclick]",
  "[data-route]",
  "[role='button']",
  ".btn",
  ".card",
  ".menu-item",
];

// Candidate modal/dialog selectors
const MODAL_SELECTORS = [
  "[role='dialog']",
  "[role='alertdialog']",
  ".modal",
  ".dialog",
  ".popup",
];

// Helpers
function hasAccessibleName(el) {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) return true;

  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const labelEl = el.ownerDocument.getElementById(id);
      if (labelEl && labelEl.textContent.trim()) return true;
    }
  }

  // visible text
  if (el.textContent && el.textContent.trim()) return true;

  // img-only buttons/links
  const img = el.querySelector("img");
  if (img) {
    const alt = img.getAttribute("alt");
    if (alt && alt.trim()) return true;
  }

  return false;
}

function isFocusable(el) {
  const tabindex = el.getAttribute("tabindex");
  if (tabindex !== null) return Number(tabindex) >= 0;
  // native focusables
  return NATIVE_INTERACTIVE.has(el.tagName);
}

describe("Accessibility: ARIA roles & attributes", () => {
  let htmlFiles = [];

  beforeAll(async () => {
    htmlFiles = await globby(["**/*.html"], {
      cwd: PUBLIC_DIR,
      ignore: ["html/demo/**/*.html"],
    });
  });

  test("interactive elements have roles and accessible labels", () => {
    const errors = [];

    for (const fileRel of htmlFiles) {
      const fileAbs = path.join(PUBLIC_DIR, fileRel);
      const html = fs.readFileSync(fileAbs, "utf8");
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      // Gather clickable candidates
      const clickable = new Set();
      for (const sel of CLICKABLE_SELECTORS) {
        doc.querySelectorAll(sel).forEach((el) => clickable.add(el));
      }

      clickable.forEach((el) => {
        const tag = el.tagName;

        // 1) If it's non-native but clickable, require role + tabindex
        const isNative =
          NATIVE_INTERACTIVE.has(tag) ||
          (tag === "A" && el.getAttribute("href"));

        if (!isNative) {
          const role = el.getAttribute("role");
          if (!role) {
            errors.push(
              `${fileRel}: non-native clickable <${tag.toLowerCase()}> missing role`,
            );
          }
          const tabindex = el.getAttribute("tabindex");
          if (tabindex === null || Number(tabindex) < 0) {
            errors.push(
              `${fileRel}: non-native clickable <${tag.toLowerCase()}> missing tabindex="0"`,
            );
          }
        }

        // 2) All interactives must have an accessible name
        if (!hasAccessibleName(el)) {
          errors.push(
            `${fileRel}: interactive <${tag.toLowerCase()}> missing accessible name (aria-label/labelledby/text/alt)`,
          );
        }

        // 3) aria-hidden elements should not be focusable
        if (el.getAttribute("aria-hidden") === "true" && isFocusable(el)) {
          errors.push(
            `${fileRel}: aria-hidden interactive <${tag.toLowerCase()}> should not be focusable`,
          );
        }
      });
    }

    if (errors.length) {
      throw new Error("ARIA issues found:\n" + errors.join("\n"));
    }
  });

  test("modals/dialogs have proper ARIA", () => {
    const errors = [];

    for (const fileRel of htmlFiles) {
      const fileAbs = path.join(PUBLIC_DIR, fileRel);
      const html = fs.readFileSync(fileAbs, "utf8");
      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const modals = new Set();
      for (const sel of MODAL_SELECTORS) {
        doc.querySelectorAll(sel).forEach((el) => modals.add(el));
      }

      modals.forEach((el) => {
        const role = el.getAttribute("role");
        if (!role || (role !== "dialog" && role !== "alertdialog")) {
          errors.push(
            `${fileRel}: modal/dialog missing role="dialog" or role="alertdialog"`,
          );
        }

        // Recommend aria-modal for true dialogs
        if (role === "dialog" && el.getAttribute("aria-modal") !== "true") {
          errors.push(`${fileRel}: dialog should include aria-modal="true"`);
        }

        // Must have accessible name
        if (!hasAccessibleName(el)) {
          errors.push(
            `${fileRel}: dialog missing accessible name (aria-label/labelledby/text)`,
          );
        }
      });
    }

    if (errors.length) {
      throw new Error("Modal ARIA issues found:\n" + errors.join("\n"));
    }
  });
});
