import { HANDOUT_ASSETS, LEARN_PANELS } from "./learn-content.js?v=20260501-3";
import { createModalController } from "./modal.js";

function setSideMenuOpen({ burgerIcon, sideMenu }, isOpen) {
  if (!sideMenu) {
    return;
  }

  sideMenu.classList.toggle("open", isOpen);
  sideMenu.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    sideMenu.removeAttribute("inert");
  } else {
    sideMenu.setAttribute("inert", "");
  }

  if (burgerIcon) {
    burgerIcon.setAttribute("aria-expanded", String(isOpen));
    burgerIcon.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }
}

function buildPanelCard(panel) {
  const card = document.createElement("article");
  card.className = "learn-explain-card";
  card.dataset.learnPanelId = panel.id;

  const image = document.createElement("img");
  image.className = "learn-explain-image";
  image.src = panel.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;

  const body = document.createElement("div");
  body.className = "learn-explain-body";

  const title = document.createElement("h3");
  title.textContent = panel.title;

  const text = document.createElement("p");
  text.textContent = panel.text;

  body.append(title, text);

  if (panel.caseLinks?.length) {
    const actions = document.createElement("div");
    actions.className = "learn-case-actions";

    panel.caseLinks.forEach((caseLink) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "learn-case-button";
      button.dataset.caseValue = caseLink.value;
      button.textContent = caseLink.label;
      actions.appendChild(button);
    });

    body.appendChild(actions);
  }

  card.append(image, body);
  return card;
}

function setActiveTab({ panels, tabs }, activeTab) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.learnTab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.learnPanel === activeTab;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

async function tryShareAsset(asset, statusElement) {
  if (!asset) {
    return;
  }

  const absoluteUrl = new URL(asset.url, window.location.href).href;
  if (!navigator.share) {
    statusElement.textContent = "Sharing is not available here. Use download.";
    return;
  }

  try {
    if (
      window.location.protocol !== "file:" &&
      window.File &&
      navigator.canShare
    ) {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const file = new File([blob], asset.filename, { type: asset.type });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: asset.title,
        });
        statusElement.textContent = "Share sheet opened.";
        return;
      }
    }

    await navigator.share({
      title: asset.title,
      url: absoluteUrl,
    });
    statusElement.textContent = "Share sheet opened.";
  } catch (error) {
    statusElement.textContent =
      error?.name === "AbortError"
        ? "Share cancelled."
        : "Sharing failed here. Use download.";
  }
}

export function initLearnModal({ dom, onBeforeOpen, onSelectCase }) {
  const {
    body,
    burgerIcon,
    sideMenu,
    infoIcon,
    infoLearnButton,
    learnMenuButton,
    learnModal,
    learnModalContent,
    learnHandoutImage,
    closeLearnModalButton,
    learnExplainList,
    learnTabs,
    learnPanels,
    learnShareStatus,
  } = dom;

  if (
    !body ||
    !learnModal ||
    !learnModalContent ||
    !closeLearnModalButton ||
    !learnExplainList ||
    !learnTabs?.length ||
    !learnPanels?.length ||
    !learnShareStatus
  ) {
    return;
  }

  const learnModalController = createModalController({
    body,
    focusRoot: learnModalContent,
    initialFocusElement: closeLearnModalButton,
    modal: learnModal,
  });

  learnExplainList.replaceChildren(
    ...LEARN_PANELS.map((panel) => buildPanelCard(panel)),
  );

  const ensureHandoutLoaded = () => {
    if (!learnHandoutImage || learnHandoutImage.src) {
      return;
    }
    const source = learnHandoutImage.dataset.src;
    if (source) {
      learnHandoutImage.src = source;
    }
  };

  const openLearnModal = (triggerElement, preferredTab = "handout") => {
    if (typeof onBeforeOpen === "function") {
      onBeforeOpen();
    }
    if (preferredTab === "handout") {
      ensureHandoutLoaded();
    }
    setActiveTab({ panels: learnPanels, tabs: learnTabs }, preferredTab);
    learnShareStatus.textContent = "";
    setSideMenuOpen({ burgerIcon, sideMenu }, false);
    if (infoIcon) {
      infoIcon.setAttribute("aria-expanded", "false");
    }
    learnModalController.open({
      triggerElement:
        triggerElement === infoLearnButton
          ? infoIcon || triggerElement
          : triggerElement,
    });
  };

  learnMenuButton?.addEventListener("click", () => {
    openLearnModal(learnMenuButton, "handout");
  });

  infoLearnButton?.addEventListener("click", () => {
    openLearnModal(infoLearnButton, "handout");
  });

  closeLearnModalButton.addEventListener("click", () => {
    learnModalController.close();
  });

  learnModal.addEventListener("click", (event) => {
    if (event.target === learnModal) {
      learnModalController.close({ restoreFocus: false });
    }
  });

  learnTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.learnTab === "handout") {
        ensureHandoutLoaded();
      }
      setActiveTab(
        { panels: learnPanels, tabs: learnTabs },
        tab.dataset.learnTab,
      );
    });
  });

  learnExplainList.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest(".learn-case-button")
        : null;
    if (!button?.dataset.caseValue) {
      return;
    }

    if (typeof onSelectCase === "function") {
      onSelectCase(button.dataset.caseValue);
    }
    learnModalController.close({ restoreFocus: false });
  });

  learnModal.addEventListener("click", (event) => {
    const shareButton =
      event.target instanceof Element
        ? event.target.closest("[data-share-resource]")
        : null;
    if (!shareButton) {
      return;
    }

    const asset = HANDOUT_ASSETS[shareButton.dataset.shareResource];
    tryShareAsset(asset, learnShareStatus);
  });

  return {
    open: openLearnModal,
  };
}
