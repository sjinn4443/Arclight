import { expect, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT_MS = 30_000;

test.describe("Fundal Reflex iOS eye rendering", () => {
  test("keeps both irises centred after imported styles finish loading", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "webkit-iphone",
      "This regression is specific to iOS WebKit stylesheet timing.",
    );

    await page.goto("/subapp/Fundal%20Reflex/index.html", {
      waitUntil: "networkidle",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    await expect(page.locator("body")).toHaveClass(/\bapp-ready\b/, {
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const eyeGeometry = await page.locator(".eye").evaluateAll((eyes) =>
      eyes.map((eye) => {
        const iris = eye.querySelector(".iris");
        const eyeRect = eye.getBoundingClientRect();
        const irisRect = iris?.getBoundingClientRect();

        return {
          eyeCenter: {
            x: eyeRect.left + eyeRect.width / 2,
            y: eyeRect.top + eyeRect.height / 2,
          },
          irisCenter: irisRect
            ? {
                x: irisRect.left + irisRect.width / 2,
                y: irisRect.top + irisRect.height / 2,
              }
            : null,
          irisSize: irisRect
            ? { width: irisRect.width, height: irisRect.height }
            : null,
        };
      }),
    );

    expect(eyeGeometry).toHaveLength(2);
    for (const geometry of eyeGeometry) {
      expect(geometry.irisCenter).not.toBeNull();
      expect(geometry.irisSize?.width).toBeGreaterThan(70);
      expect(geometry.irisSize?.height).toBeGreaterThan(70);
      expect(
        Math.abs(geometry.irisCenter.x - geometry.eyeCenter.x),
      ).toBeLessThan(4);
      expect(
        Math.abs(geometry.irisCenter.y - geometry.eyeCenter.y),
      ).toBeLessThan(4);
    }
  });
});
