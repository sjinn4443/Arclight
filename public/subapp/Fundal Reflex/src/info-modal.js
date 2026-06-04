import { createModalController } from "./modal.js";

export function initInfoModal(dom) {
  const { body, infoIcon, infoModal, infoModalContent, closeModal } = dom;
  if (!body || !infoIcon || !infoModal || !infoModalContent || !closeModal) {
    return;
  }

  const infoModalController = createModalController({
    body,
    focusRoot: infoModalContent,
    initialFocusElement: closeModal,
    modal: infoModal,
  });

  infoIcon.addEventListener("click", () => {
    infoModalController.toggle({ triggerElement: infoIcon });
    infoIcon.setAttribute(
      "aria-expanded",
      String(infoModalController.isOpen()),
    );
  });

  closeModal.addEventListener("click", () => {
    infoModalController.close();
    infoIcon.setAttribute("aria-expanded", "false");
  });

  infoModal.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      infoModalController.close();
      infoIcon.setAttribute("aria-expanded", "false");
    }
  });

  infoModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      infoIcon.setAttribute("aria-expanded", "false");
    }
  });

  return {
    close: ({ restoreFocus = false } = {}) => {
      infoModalController.close({ restoreFocus });
      infoIcon.setAttribute("aria-expanded", "false");
    },
    isOpen: () => infoModalController.isOpen(),
  };
}
