/** @jest-environment jsdom */
import { beforeEach, afterEach, expect, it, jest } from "@jest/globals";

let listeners;
beforeEach(() => {
  jest.resetModules();
  jest.useFakeTimers();
  localStorage.clear();
  delete document.body.dataset.currentRoute;
  document.body.innerHTML = '<button id="browse">Browse</button>';
  window.matchMedia = () => ({ matches: false });
  listeners = [];
  const add = document.addEventListener.bind(document);
  jest
    .spyOn(document, "addEventListener")
    .mockImplementation((type, listener, options) => {
      listeners.push([type, listener]);
      add(type, listener, options);
    });
});
afterEach(() => {
  listeners.forEach(([type, listener]) =>
    document.removeEventListener(type, listener),
  );
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete window.caches;
});
const click = (count) => {
  for (let i = 0; i < count; i++) document.querySelector("#browse").click();
};

it("invites on click 15, continues across page visits and offers the download chooser only on acceptance", async () => {
  const app = await import("../public/js/downloadSuggestion.js");
  const open = jest.fn();
  app.initializeDownloadSuggestion(open);
  click(14);
  await jest.runAllTimersAsync();
  expect(document.querySelector("#downloadSuggestionModal")).toBeNull();
  // Dashboard initialization repeats as the user returns; it must not reset the count.
  app.initializeDownloadSuggestion(open);
  click(1);
  await jest.runAllTimersAsync();
  expect(document.querySelector("#downloadSuggestionModal")).not.toBeNull();
  expect(open).not.toHaveBeenCalled();
  document.querySelector("#downloadSuggestionStart").click();
  expect(open).toHaveBeenCalledTimes(1);
  click(20);
  await jest.runAllTimersAsync();
  expect(document.querySelector("#downloadSuggestionModal")).toBeNull();
});

it.each(["dismissed", "downloaded", "installed", "legacy"])(
  "does not invite %s users",
  async (kind) => {
    if (kind === "dismissed")
      localStorage.setItem("arclight:download-suggestion-shown", "1");
    if (kind === "downloaded")
      localStorage.setItem("arclight:download-started", "1");
    if (kind === "installed") window.matchMedia = () => ({ matches: true });
    if (kind === "legacy")
      window.caches = {
        keys: async () => ["arclight-packs-v1"],
        open: async () => ({ keys: async () => [{ url: "/videos/a.mp4" }] }),
      };
    const app = await import("../public/js/downloadSuggestion.js");
    app.initializeDownloadSuggestion(jest.fn());
    click(15);
    await jest.runAllTimersAsync();
    expect(document.querySelector("#downloadSuggestionModal")).toBeNull();
  },
);

it.each(["onboarding", "account", "interest", "intro", "languageinstall"])(
  "does not count clicks or interrupt the %s flow",
  async (route) => {
    const app = await import("../public/js/downloadSuggestion.js");
    app.initializeDownloadSuggestion(jest.fn());
    document.body.dataset.currentRoute = route;
    click(20);
    await jest.runAllTimersAsync();
    expect(document.querySelector("#downloadSuggestionModal")).toBeNull();
    expect(
      localStorage.getItem("arclight:download-suggestion-clicks"),
    ).toBeNull();
    document.body.dataset.currentRoute = "dashboard";
    click(15);
    await jest.runAllTimersAsync();
    expect(document.querySelector("#downloadSuggestionModal")).not.toBeNull();
  },
);

it("rechecks the route when a pending invitation would display", async () => {
  const app = await import("../public/js/downloadSuggestion.js");
  app.initializeDownloadSuggestion(jest.fn());
  click(15);
  document.body.dataset.currentRoute = "account";
  await jest.runAllTimersAsync();
  expect(document.querySelector("#downloadSuggestionModal")).toBeNull();
  expect(localStorage.getItem("arclight:download-suggestion-shown")).toBeNull();
});
