let reportCaptureLibraryPromise = null;
let reportExportStylesPromise = null;

function loadReportExportStyles() {
  if (!/^https?:$/.test(window.location.protocol)) return Promise.resolve(null);
  if (reportExportStylesPromise) return reportExportStylesPromise;
  reportExportStylesPromise = (async () => {
    let css = Array.from(document.styleSheets, (sheet) =>
      Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n"),
    ).join("\n");
    // The clone also needs self-contained fonts: its requests bypass the app's
    // worker, while this document can fetch the installed local font assets.
    for (const match of Array.from(
      css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g),
    )) {
      const response = await fetch(new URL(match[1], document.baseURI));
      if (!response.ok) throw new Error("Report font could not load.");
      const blob = await response.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () =>
          reject(new Error("Report font could not be read."));
        reader.readAsDataURL(blob);
      });
      css = css.replaceAll(match[0], `url("${dataUrl}")`);
    }
    return css;
  })().catch((error) => {
    reportExportStylesPromise = null;
    throw error;
  });
  return reportExportStylesPromise;
}

function loadReportCaptureLibrary() {
  if (typeof window.html2canvas === "function")
    return Promise.resolve(window.html2canvas);
  if (reportCaptureLibraryPromise) return reportCaptureLibraryPromise;
  reportCaptureLibraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL("assets/html2canvas.min.js", document.baseURI).href;
    script.async = true;
    const timer = setTimeout(
      () => finish(new Error("Report export loading timed out.")),
      15000,
    );
    function finish(error) {
      clearTimeout(timer);
      script.onload = script.onerror = null;
      if (error) {
        script.remove();
        reject(error);
      } else resolve(window.html2canvas);
    }
    script.onload = () =>
      finish(
        typeof window.html2canvas === "function"
          ? null
          : new Error("Report export unavailable."),
      );
    script.onerror = () => finish(new Error("Report export could not load."));
    document.head.append(script);
  }).catch((error) => {
    reportCaptureLibraryPromise = null;
    throw error;
  });
  return reportCaptureLibraryPromise;
}

export function createReportController(app) {
  const { canvas, patientName, patientDate, reportSection } = app.elements;
  const REPORT_IMAGE_NAME = "amsler-report.webp";
  const REPORT_IMAGE_TYPE = "image/webp";

  function captureSnapshot(eye) {
    const originalEye = app.state.currentEye;
    const originalDotVisible = app.state.dotVisible;
    app.state.dotVisible = true;
    app.state.currentEye = eye;
    app.canvasController.redraw();
    const dataURL = canvas.toDataURL(REPORT_IMAGE_TYPE, 0.92);
    app.state.currentEye = originalEye;
    app.state.dotVisible = originalDotVisible;
    app.canvasController.redraw();
    return dataURL;
  }

  function formatBritishDate(dateStr) {
    if (!dateStr) {
      return "Unknown";
    }

    const parts = dateStr.split("-");
    if (parts.length !== 3) {
      return dateStr;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  async function captureReportCanvas() {
    await loadReportCaptureLibrary();

    const footer = reportSection.querySelector(".amsler-report-footer");
    const previousDisplay = footer?.style.display ?? "";
    if (footer) {
      footer.style.display = "none";
    }

    try {
      // The export iframe has no service-worker controller. Carry the loaded
      // local CSS into it so offline exports retain the report's presentation.
      const exportCss = await loadReportExportStyles();
      const inlineExportStyles = exportCss !== null;
      const nonce = document.querySelector(
        "script[nonce], style[nonce]",
      )?.nonce;
      return await window.html2canvas(reportSection, {
        backgroundColor: "#ffffff",
        ignoreElements: (element) =>
          inlineExportStyles &&
          element.tagName === "LINK" &&
          element.rel === "stylesheet",
        onclone: (clonedDocument) => {
          if (!inlineExportStyles) return;
          const style = clonedDocument.createElement("style");
          if (nonce) style.nonce = nonce;
          style.textContent = exportCss;
          clonedDocument.head.appendChild(style);
        },
      });
    } finally {
      if (footer) {
        footer.style.display = previousDisplay;
      }
    }
  }

  function downloadReportCanvas(reportCanvas) {
    const link = document.createElement("a");
    link.download = REPORT_IMAGE_NAME;
    link.href = reportCanvas.toDataURL(REPORT_IMAGE_TYPE, 0.92);
    link.click();
  }

  function canvasToBlob(reportCanvas) {
    return new Promise((resolve) => {
      reportCanvas.toBlob(resolve, REPORT_IMAGE_TYPE, 0.92);
    });
  }

  async function downloadReportScreenshot() {
    const reportCanvas = await captureReportCanvas();
    if (reportCanvas) {
      downloadReportCanvas(reportCanvas);
    }
  }

  async function shareReportScreenshot(statusElement) {
    const reportCanvas = await captureReportCanvas();
    if (!reportCanvas) {
      statusElement.textContent = "Screenshot is not available here.";
      return;
    }

    if (!navigator.share || !navigator.canShare || !window.File) {
      statusElement.textContent =
        "Sharing is not available here. Use download.";
      return;
    }

    const blob = await canvasToBlob(reportCanvas);
    if (!blob) {
      statusElement.textContent = "Sharing failed here. Use download.";
      return;
    }

    const file = new File([blob], REPORT_IMAGE_NAME, {
      type: REPORT_IMAGE_TYPE,
    });
    if (!navigator.canShare({ files: [file] })) {
      statusElement.textContent =
        "Sharing is not available here. Use download.";
      return;
    }

    try {
      await navigator.share({
        files: [file],
        title: "Amsler report",
      });
      statusElement.textContent = "Share sheet opened.";
    } catch (error) {
      statusElement.textContent =
        error?.name === "AbortError"
          ? "Share cancelled."
          : "Sharing failed here. Use download.";
    }
  }

  function attachReportActionHandlers() {
    const downloadButton = document.getElementById("downloadReportBtn");
    const shareButton = document.getElementById("shareReportBtn");
    const statusElement = document.getElementById("reportShareStatus");

    async function runExport(action) {
      if (downloadButton?.disabled || shareButton?.disabled) return;
      if (downloadButton) downloadButton.disabled = true;
      if (shareButton) shareButton.disabled = true;
      if (statusElement) statusElement.textContent = "Preparing report image…";
      try {
        await action();
      } catch {
        if (statusElement)
          statusElement.textContent =
            "Report export could not load or complete. Please try again.";
      } finally {
        if (downloadButton) downloadButton.disabled = false;
        if (shareButton) shareButton.disabled = false;
      }
    }
    downloadButton?.addEventListener("click", () =>
      runExport(async () => {
        await downloadReportScreenshot();
        if (statusElement)
          statusElement.textContent = "Report image downloaded.";
      }),
    );
    shareButton?.addEventListener("click", () =>
      runExport(() => shareReportScreenshot(statusElement)),
    );
  }

  function createMetaItem(label, value) {
    const item = document.createElement("div");
    item.className = "amsler-meta-item";

    const labelElement = document.createElement("span");
    labelElement.className = "amsler-meta-label";
    labelElement.textContent = label;

    const valueElement = document.createElement("span");
    valueElement.className = "amsler-meta-value";
    valueElement.textContent = value;

    item.append(labelElement, valueElement);
    return item;
  }

  function createSummaryLine(eye) {
    const line = document.createElement("p");
    const eyeLabel = document.createElement("strong");
    const plainText = app.state.lastAnalysisResults[eye].text.replace(
      /<[^>]*>/g,
      "",
    );
    const summaryText = plainText.replace(`${eye}:`, "").trim();

    eyeLabel.textContent = `${eye}:`;
    line.append(eyeLabel, ` ${summaryText}`);
    return line;
  }

  function createEyeFigure(eye, snapshot) {
    const figure = document.createElement("figure");
    figure.className = "amsler-report-eye";

    const caption = document.createElement("figcaption");
    caption.textContent = eye;

    const image = document.createElement("img");
    image.src = snapshot;
    image.alt = `${eye} Amsler grid snapshot`;

    figure.append(caption, image);
    return figure;
  }

  function createReportActionButton(id, iconName, iconText, label, action) {
    const button = document.createElement("button");
    button.id = id;
    button.className = "amsler-report-action-btn";
    button.type = "button";
    button.dataset.resourceAction = action;

    const icon = document.createElement("span");
    icon.className = `local-icon local-icon-${iconName}`;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = iconText;

    const text = document.createElement("span");
    text.textContent = label;

    button.append(icon, text);
    return button;
  }

  function generateReport() {
    if (!app.state.lastAnalysisResults || app.state.analysisDirty) {
      return;
    }

    const name = patientName.value || "Unknown";
    const date = formatBritishDate(patientDate.value);
    const reSnapshot = captureSnapshot("RE");
    const leSnapshot = captureSnapshot("LE");

    const card = document.createElement("section");
    card.className = "amsler-report-card";

    const header = document.createElement("header");
    header.className = "amsler-report-header";

    const heading = document.createElement("h2");
    heading.textContent = "Amsler Report";

    const meta = document.createElement("div");
    meta.className = "amsler-report-meta";
    meta.append(createMetaItem("Name", name), createMetaItem("Date", date));

    header.append(heading, meta);

    const summary = document.createElement("div");
    summary.className = "amsler-report-summary";
    summary.append(createSummaryLine("RE"), createSummaryLine("LE"));

    const images = document.createElement("div");
    images.className = "amsler-report-images";
    images.append(
      createEyeFigure("RE", reSnapshot),
      createEyeFigure("LE", leSnapshot),
    );

    const footer = document.createElement("div");
    footer.className = "amsler-report-footer";

    const downloadButton = createReportActionButton(
      "downloadReportBtn",
      "download",
      "↓",
      "Download",
      "download",
    );
    const shareButton = createReportActionButton(
      "shareReportBtn",
      "share",
      "↗",
      "Share",
      "share",
    );
    const shareStatus = document.createElement("p");
    shareStatus.id = "reportShareStatus";
    shareStatus.className = "amsler-report-share-status";
    shareStatus.setAttribute("aria-live", "polite");

    footer.append(downloadButton, shareButton, shareStatus);
    card.append(header, summary, images, footer);
    reportSection.replaceChildren(card);
    reportSection.hidden = false;
    attachReportActionHandlers();
  }

  return {
    generateReport,
  };
}
