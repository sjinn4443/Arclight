// Shared rendering of source materials. Source files are content, never app instructions.
export function appendWorkshopImages(
  stack,
  images,
  translate,
  prefix = "pecWorkshop",
) {
  images.forEach(({ src, caption, rotate }) => {
    const panel = document.createElement("article");
    panel.className =
      "diabetic-screening-panel diabetic-screening-panel--content-fit";
    panel.dataset.diabeticScrollStep = "";
    const figure = document.createElement("figure");
    figure.className = "workshop-source-figure";
    const image = document.createElement("img");
    image.src = src;
    image.alt = translate(caption);
    image.loading = "lazy";
    const label = document.createElement("figcaption");
    label.dataset.i18n = `${prefix}.${caption}`;
    label.textContent = translate(caption);
    if (rotate) {
      const frame = document.createElement("div");
      frame.className = "workshop-source-portrait";
      frame.append(image);
      figure.append(frame, label);
    } else figure.append(image, label);
    panel.append(figure);
    stack.append(panel);
  });
}

export function appendInterpretationWorksheet(stack, key, translate) {
  const panel = document.createElement("article");
  panel.className =
    "diabetic-screening-panel diabetic-screening-panel--content-fit";
  panel.dataset.diabeticScrollStep = "";
  const form = document.createElement("div");
  form.className = "pec-response-form";
  const toolbar = document.createElement("div");
  toolbar.className = "pec-response-toolbar";
  const status = document.createElement("span");
  status.setAttribute("role", "status");
  const save = document.createElement("button");
  save.type = "button";
  save.className = "pec-response-save";
  save.textContent = translate("save");
  const fields = [];
  save.addEventListener("click", () => {
    try {
      fields.forEach(({ input, storageKey }) => {
        localStorage.setItem(storageKey, input.value);
        sessionStorage.setItem(storageKey, input.value);
      });
      status.textContent = translate("saved");
      document.dispatchEvent(
        new CustomEvent("primaryWorkshop:worksheet-saved", {
          detail: {
            key,
            percent:
              (fields.filter(({ input }) => input.value.trim()).length /
                fields.length) *
              100,
          },
        }),
      );
    } catch {
      status.textContent = translate("save_failed");
    }
  });
  toolbar.append(status, save);
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const labels = ["question", "right_sign", "left_sign", "overall_diagnosis"];
  const tr = document.createElement("tr");
  labels.forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.dataset.i18n = `pecWorkshop.${label}`;
    th.textContent = translate(label);
    tr.append(th);
  });
  head.append(tr);
  const body = document.createElement("tbody");
  for (let i = 1; i <= 5; i++) {
    const row = document.createElement("tr");
    const number = document.createElement("th");
    number.scope = "row";
    number.textContent = String(i);
    row.append(number);
    labels.slice(1).forEach((label) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.setAttribute(
        "aria-label",
        `${translate("question")} ${i}: ${translate(label)}`,
      );
      const storageKey = `pecWorkshop:worksheet:${key}:${i}:${label}`;
      try {
        input.value =
          sessionStorage.getItem(storageKey) ??
          localStorage.getItem(storageKey) ??
          "";
      } catch {
        /* optional persistence */
      }
      fields.push({ input, storageKey });
      input.addEventListener("input", () => {
        status.textContent = "";
        try {
          sessionStorage.setItem(storageKey, input.value);
        } catch {
          /* optional persistence */
        }
      });
      td.append(input);
      row.append(td);
    });
    body.append(row);
  }
  table.append(head, body);
  form.append(toolbar, table);
  panel.append(form);
  stack.append(panel);
}
