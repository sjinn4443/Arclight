/**
 * @jest-environment node
 */

import fs from "fs/promises";
import path from "path";
import { JSDOM } from "jsdom";

const publicDir = path.join(__dirname, "..", "public");
const allHtmlFiles = new Set();

import globby from "globby";

const HTML_GLOB = ["**/*.html"];
const HTML_IGNORE = ["html/demo/**/*.html"];

describe("Link Integrity Tests", () => {
  beforeAll(async () => {
    const files = await globby(HTML_GLOB, {
      cwd: publicDir,
      ignore: HTML_IGNORE,
    });
    files.forEach((file) => {
      allHtmlFiles.add(file.replace(/\\/g, "/"));
    });
  });

  it("should have no broken links in any HTML file", async () => {
    const brokenLinks = [];

    for (const htmlFile of allHtmlFiles) {
      const filePath = path.join(publicDir, htmlFile);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const dom = new JSDOM(fileContent);
      const document = dom.window.document;

      const links = document.querySelectorAll("a[href]");
      for (const link of links) {
        const href = link.getAttribute("href");

        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("http")
        ) {
          continue;
        }

        // Resolve the path relative to the current HTML file
        let resolvedPath;
        if (href.startsWith("subapp/")) {
          resolvedPath = path.resolve(publicDir, href);
        } else {
          resolvedPath = path.resolve(path.dirname(filePath), href);
        }
        const relativePath = path
          .relative(publicDir, resolvedPath)
          .replace(/\\/g, "/");

        try {
          await fs.access(path.join(publicDir, relativePath));
        } catch (error) {
          brokenLinks.push({
            file: htmlFile,
            link: href,
            resolved: relativePath,
          });
        }
      }
    }

    expect(brokenLinks).toEqual([]);
  }, 30000); // Increase timeout for crawling files
});
