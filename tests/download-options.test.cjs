/** @jest-environment jsdom */
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

describe("download options", () => {
  let app;
  const manifest = {
    assets: [
      { url: "/js/main.js", bytes: 100 },
      { url: "/images/learning/history-case.webp", bytes: 200 },
      { url: "/videos/Core/Pupils/pupil_220p.mp4", bytes: 300 },
      { url: "/videos/Core/Pupils/pupil_720p.mp4", bytes: 900 },
      { url: "/subapp/Mires/index.html", bytes: 400 },
    ],
  };

  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = "";
    localStorage.clear();
    window.I18N = { getLanguage: () => "en", translateLiteral: (text) => text };
    app = await import("../public/js/languageinstall.js");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete window.caches;
    delete navigator.serviceWorker;
    delete global.MessageChannel;
  });

  it("unions multiple sections once and preserves video quality filtering", () => {
    const selection = app.resolveOfflineDownloadSelection(manifest, {
      mode: "select",
      catalogIds: ["core", "core-pupils", "core-history", "core-pupils"],
      videoQuality: "low",
    });
    expect(selection.urls).toEqual([
      "/js/main.js",
      "/images/learning/history-case.webp",
      "/videos/Core/Pupils/pupil_220p.mp4",
      "/subapp/Mires/index.html",
    ]);
    expect(selection.bytes).toBe(1000);
    expect(selection.catalogIds).toEqual([
      "core",
      "core-pupils",
      "core-history",
    ]);
    expect(selection.label).toContain(
      "Core Examination, Pupils, History Taking",
    );
  });

  it.each([
    ["procedure-lid-hygiene", "1.Cleananeye"],
    ["procedure-lid-hygiene", "2.Warmcompress"],
    ["procedure-irrigation", "3.Irrigateaneye"],
    ["procedure-foreign-body", "4.ForeignBodyRemoval"],
    ["procedure-eyelash-removal", "5.RemoveEyeLash"],
    ["procedure-drops", "6.InstileyedropsNointment"],
    ["procedure-eye-pad", "7.MakepadNshield"],
    ["procedure-eye-pad", "8.Applypadandshield"],
    ["procedure-sight-loss", "11.GuideBlindPerson"],
  ])("matches the existing %s procedure video %s", (id, name) => {
    const url = `/videos/Workshop/PEC/${name}_220p.mp4`;
    expect(app.matchesOfflineCatalog(url, id)).toBe(true);
    const selection = app.resolveOfflineDownloadSelection(
      {
        assets: [
          { url, bytes: 100 },
          { url: "/videos/Workshop/MedStudents/Media1.mp4", bytes: 200 },
        ],
      },
      { mode: "select", catalogIds: [id] },
    );
    expect(selection.urls).toEqual([url]);
  });

  it("shows real cache status, groups the checkboxes and prevents an empty selection", async () => {
    window.caches = {
      keys: async () => ["arclight-static-test"],
      open: async () => ({
        keys: async () => [
          { url: "http://localhost/js/main.js" },
          { url: "http://localhost/images/learning/history-case.webp" },
          { url: "http://localhost/videos/Core/Pupils/pupil_220p.mp4" },
        ],
      }),
    };
    const choice = app.showDownloadAppModal(manifest);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(
      document.querySelector('[data-download-status="core-history"]')
        .textContent,
    ).toBe("Completed");
    expect(
      document.querySelector('[data-download-status="core-pupils"]')
        .textContent,
    ).toBe("Partly downloaded");
    expect(
      document.querySelector(
        '[data-download-status="core-interactive-learning"]',
      ).textContent,
    ).toBe("Not downloaded");
    expect(document.getElementById("offlineFullContentSize").textContent).toBe(
      "Download size: 2 KB",
    );
    const select = document.querySelector('input[value="select"]');
    select.checked = true;
    select.dispatchEvent(new Event("change"));
    const list = document.getElementById("offlineCatalogSelect");
    expect(list.closest(".download-selection-card").contains(select)).toBe(
      true,
    );
    expect(document.getElementById("downloadAllBtn").disabled).toBe(true);
    expect(
      [
        ...document.querySelectorAll(
          ".download-group summary > span:first-child",
        ),
      ].map((item) => item.textContent),
    ).toEqual(["Examination", "Eye Care Procedure", "Conditions", "Workshops"]);
    document.querySelector('input[value="core-history"]').click();
    document.querySelector('input[value="core-pupils"]').click();
    document.getElementById("downloadAllBtn").click();
    expect((await choice).catalogIds).toEqual(["core-history", "core-pupils"]);
  });

  it("offers workshop children and downloads all workshops with one action", async () => {
    const workshopManifest = {
      assets: [
        { url: "/js/main.js", bytes: 100 },
        { url: "/images/workshop/PEC/FundalReflex.webp", bytes: 200 },
        { url: "/videos/Workshop/MedStudents/Media1.mp4", bytes: 300 },
        { url: "/videos/Workshop/Diabetic/lesson.mp4", bytes: 400 },
        { url: "/videos/USAID/lesson.mp4", bytes: 500 },
        { url: "/videos/Workshop/Glaucoma/lesson.mp4", bytes: 600 },
      ],
    };
    const choice = app.showDownloadAppModal(workshopManifest);
    const group = document.querySelector('[data-download-group="workshops"]');
    expect(
      [...group.querySelectorAll(".download-section__title")].map(
        (item) => item.textContent,
      ),
    ).toEqual([
      "PEC",
      "Medical Students",
      "Childhood Eye Screening",
      "Glaucoma",
      "Diabetic Retinopathy",
    ]);
    group.querySelector(".download-group__all").click();
    const selection = app.resolveOfflineDownloadSelection(
      workshopManifest,
      await choice,
    );
    expect(selection.catalogIds).toEqual(["workshops"]);
    expect(selection.urls).toEqual(
      workshopManifest.assets.map((asset) => asset.url),
    );
    const medical = app.resolveOfflineDownloadSelection(workshopManifest, {
      mode: "select",
      catalogIds: ["workshop-medical-students"],
    });
    expect(medical.urls).toContain("/videos/Workshop/MedStudents/Media1.mp4");
    expect(medical.urls).not.toContain("/videos/Workshop/Diabetic/lesson.mp4");
    expect(
      document.querySelector('input[value="procedure-irrigation"]').disabled,
    ).toBe(true);
  });

  async function startDownload() {
    let port;
    const requests = [];
    let posted;
    const started = new Promise((resolve) => {
      posted = resolve;
    });
    global.MessageChannel = class {
      constructor() {
        this.port1 = { close: jest.fn(), postMessage: jest.fn() };
        this.port2 = this.port1;
      }
    };
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        ready: Promise.resolve({
          active: {
            postMessage: (_message, ports) => {
              requests.push(_message);
              port = ports[0];
              posted();
            },
          },
        }),
      },
    });
    const download = app.cacheOfflineUrls({
      urls: ["/a", "/b", "/c"],
      bytes: 300,
      label: "Test",
    });
    await started;
    return {
      download,
      requests,
      cancellation: () => port.postMessage,
      send: (data) => port.onmessage({ data }),
    };
  }

  it("updates real progress and leaves the green completion visible", async () => {
    const { download, send } = await startDownload();
    send({ type: "CACHE_PROGRESS", processed: 1, total: 3, failed: 0 });
    expect(document.getElementById("downloadProgressBar").value).toBe(1);
    expect(document.getElementById("downloadProgressPercent").textContent).toBe(
      "33%",
    );
    expect(document.getElementById("downloadProgressStatus").textContent).toBe(
      "In progress",
    );
    send({ type: "CACHE_DONE", cached: 3, total: 3, failed: [] });
    await download;
    expect(document.getElementById("downloadProgressPercent").textContent).toBe(
      "100%",
    );
    expect(
      document
        .getElementById("downloadProgressStatus")
        .classList.contains("download-status--complete"),
    ).toBe(true);
    document.getElementById("notNowBtn").click();
    expect(
      document.getElementById("downloadAppModal").classList.contains("hidden"),
    ).toBe(true);
  });

  it("does not count failed files as downloaded and shows orange partial progress", async () => {
    const { download, send } = await startDownload();
    send({ type: "CACHE_PROGRESS", processed: 3, total: 3, failed: 1 });
    expect(document.getElementById("downloadProgressText").textContent).toBe(
      "Downloaded 2 of 3 files (1 failed).",
    );
    const result = download.catch((error) => error);
    send({ type: "CACHE_DONE", cached: 2, total: 3, failed: ["/c"] });
    app.showDownloadErrorModal(await result);
    expect(document.getElementById("downloadProgressBar").value).toBe(2);
    expect(
      document
        .getElementById("downloadProgressStatus")
        .classList.contains("download-status--partial"),
    ).toBe(true);
    expect(
      document.querySelector(".download-failed-list").textContent,
    ).toContain("c");
  });

  it("keeps downloading when the English pause confirmation is declined", async () => {
    const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);
    const { download, send, cancellation } = await startDownload();
    document.getElementById("notNowBtn").click();
    expect(confirm).toHaveBeenCalledWith(
      "Are you sure you want to pause this download? Already downloaded files will be kept.",
    );
    expect(cancellation()).not.toHaveBeenCalled();
    send({ type: "CACHE_DONE", cached: 3, total: 3, failed: [] });
    expect(await download).toBe(true);
  });

  it("pauses via the service-worker port and resumes the original selection", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const { download, send, requests, cancellation } = await startDownload();
    send({ type: "CACHE_PROGRESS", processed: 1, total: 3, failed: 0 });
    document.getElementById("notNowBtn").click();
    expect(cancellation()).toHaveBeenCalledWith({ type: "CACHE_CANCEL" });
    send({ type: "CACHE_PAUSED", cached: 1, total: 3, failed: [] });
    expect(await download).toBe(false);
    expect(document.getElementById("downloadProgressStatus").textContent).toBe(
      "Paused",
    );
    expect(document.getElementById("downloadProgressBar").value).toBe(1);
    const resume = document.getElementById("downloadAllBtn");
    expect(resume.textContent).toBe("Resume download");
    resume.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(requests).toHaveLength(2);
    expect(requests[1].payload).toEqual(["/a", "/b", "/c"]);
    send({ type: "CACHE_DONE", cached: 3, total: 3, failed: [] });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.getElementById("downloadProgressStatus").textContent).toBe(
      "Completed",
    );
  });

  it("can pause while service-worker setup is still pending", async () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { ready: new Promise(() => {}) },
    });
    const download = app.cacheOfflineUrls({
      urls: ["/a"],
      bytes: 100,
      label: "Test",
    });
    document.getElementById("notNowBtn").click();
    expect(await download).toBe(false);
    expect(document.getElementById("downloadProgressStatus").textContent).toBe(
      "Paused",
    );
  });
});
