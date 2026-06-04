export function createReportController(app) {
  const { canvas, patientName, patientDate, reportSection } = app.elements;
  const REPORT_IMAGE_NAME = "amsler-report.webp";
  const REPORT_IMAGE_TYPE = "image/webp";

  function captureSnapshot(eye) {
    const originalEye = app.state.currentEye;
    app.state.currentEye = eye;
    app.canvasController.redraw();
    app.analysisController.drawMergedDefects();
    const dataURL = canvas.toDataURL(REPORT_IMAGE_TYPE, 0.92);
    app.state.currentEye = originalEye;
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
    if (!window.html2canvas) {
      return null;
    }

    const footer = reportSection.querySelector(".amsler-report-footer");
    const previousDisplay = footer?.style.display ?? "";
    if (footer) {
      footer.style.display = "none";
    }

    try {
      return await window.html2canvas(reportSection, {
        backgroundColor: "#ffffff",
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

    downloadButton?.addEventListener("click", () => {
      if (statusElement) {
        statusElement.textContent = "";
      }
      downloadReportScreenshot();
    });

    shareButton?.addEventListener("click", () => {
      if (statusElement) {
        statusElement.textContent = "";
        shareReportScreenshot(statusElement);
      }
    });
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

  function createReportActionButton(id, iconClass, label, action) {
    const button = document.createElement("button");
    button.id = id;
    button.className = "amsler-report-action-btn";
    button.type = "button";
    button.dataset.resourceAction = action;

    const icon = document.createElement("i");
    icon.className = iconClass;
    icon.setAttribute("aria-hidden", "true");

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
      "fas fa-download",
      "Download",
      "download",
    );
    const shareButton = createReportActionButton(
      "shareReportBtn",
      "fas fa-share-alt",
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
