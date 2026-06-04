function clearMask(maskElement) {
  if (!maskElement) {
    return;
  }

  maskElement.style.opacity = "0";
}

function applyMaskConfig(maskElement, config) {
  maskElement.style.width = config.width;
  maskElement.style.height = config.height;
  maskElement.style.minWidth = config.minWidth;
  maskElement.style.minHeight = config.minHeight;
  maskElement.style.maxWidth = config.maxWidth;
  maskElement.style.maxHeight = config.maxHeight;
  maskElement.style.borderRadius = config.borderRadius;
  maskElement.style.transform = config.transform;
  maskElement.style.background = config.background;
  maskElement.style.filter = config.filter;
  maskElement.style.opacity = config.opacity;
}

function getPosteriorCapsularThickeningMaskConfig() {
  return {
    width: "104%",
    height: "92%",
    minWidth: "24px",
    minHeight: "22px",
    maxWidth: "48px",
    maxHeight: "42px",
    borderRadius: "44% 56% 50% 48% / 50% 42% 60% 48%",
    transform: "translate(-50%, -50%) rotate(-9deg)",
    background: `
      radial-gradient(
        ellipse 94% 86% at 50% 50%,
        rgba(0, 0, 0, 0.34) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0.16) 60%,
        rgba(0, 0, 0, 0) 80%
      ),
      linear-gradient(
        19deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 22%,
        rgba(0, 0, 0, 0.62) 27%,
        rgba(0, 0, 0, 0.78) 29%,
        rgba(0, 0, 0, 0.34) 33%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -16deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 30%,
        rgba(0, 0, 0, 0.58) 34%,
        rgba(0, 0, 0, 0.74) 36%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(0, 0, 0, 0) 47%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        57deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0.54) 43%,
        rgba(0, 0, 0, 0.68) 45%,
        rgba(0, 0, 0, 0.28) 49%,
        rgba(0, 0, 0, 0) 56%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -51deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 48%,
        rgba(0, 0, 0, 0.48) 52%,
        rgba(0, 0, 0, 0.62) 54%,
        rgba(0, 0, 0, 0.26) 58%,
        rgba(0, 0, 0, 0) 64%,
        rgba(0, 0, 0, 0) 100%
      ),
      radial-gradient(
        ellipse 18% 16% at 28% 30%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.46) 32%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 16% 14% at 66% 62%,
        rgba(0, 0, 0, 0.66) 0%,
        rgba(0, 0, 0, 0.4) 34%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 13% 12% at 48% 42%,
        rgba(0, 0, 0, 0.62) 0%,
        rgba(0, 0, 0, 0.34) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 10% at 58% 30%,
        rgba(0, 0, 0, 0.56) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 11% at 40% 68%,
        rgba(0, 0, 0, 0.54) 0%,
        rgba(0, 0, 0, 0.24) 34%,
        rgba(0, 0, 0, 0) 62%
      )
    `,
    filter: "blur(0.04px)",
    opacity: "0.9",
  };
}

function getPosteriorPoleCataractMaskConfig() {
  return {
    width: "48%",
    height: "48%",
    minWidth: "13px",
    minHeight: "13px",
    maxWidth: "26px",
    maxHeight: "26px",
    borderRadius: "28% 66% 34% 72% / 36% 24% 78% 62%",
    transform: "translate(-50%, -50%) rotate(-13deg)",
    background: `
      radial-gradient(
        ellipse 74% 72% at 50% 50%,
        rgba(8, 8, 8, 0.98) 0%,
        rgba(8, 8, 8, 0.98) 34%,
        rgba(8, 8, 8, 0.9) 46%,
        rgba(8, 8, 8, 0.36) 58%,
        rgba(8, 8, 8, 0) 72%
      ),
      radial-gradient(
        ellipse 20% 16% at 18% 52%,
        rgba(0, 0, 0, 0.99) 0%,
        rgba(0, 0, 0, 0.9) 34%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 18% 15% at 22% 46%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 20% 18% at 28% 34%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.86) 38%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 18% 16% at 72% 32%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 72%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 34% 70%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.78) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 16% 14% at 78% 56%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 82% 64%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      conic-gradient(
        from 8deg at 50% 50%,
        rgba(0, 0, 0, 0) 0deg,
        rgba(0, 0, 0, 0) 10deg,
        rgba(0, 0, 0, 0.92) 10deg,
        rgba(0, 0, 0, 0.92) 30deg,
        rgba(0, 0, 0, 0) 30deg,
        rgba(0, 0, 0, 0) 50deg,
        rgba(0, 0, 0, 0.84) 50deg,
        rgba(0, 0, 0, 0.84) 68deg,
        rgba(0, 0, 0, 0) 68deg,
        rgba(0, 0, 0, 0) 96deg,
        rgba(0, 0, 0, 0.88) 96deg,
        rgba(0, 0, 0, 0.88) 118deg,
        rgba(0, 0, 0, 0) 118deg,
        rgba(0, 0, 0, 0) 146deg,
        rgba(0, 0, 0, 0.82) 146deg,
        rgba(0, 0, 0, 0.82) 164deg,
        rgba(0, 0, 0, 0) 164deg,
        rgba(0, 0, 0, 0) 196deg,
        rgba(0, 0, 0, 0.86) 196deg,
        rgba(0, 0, 0, 0.86) 218deg,
        rgba(0, 0, 0, 0) 218deg,
        rgba(0, 0, 0, 0) 248deg,
        rgba(0, 0, 0, 0.84) 248deg,
        rgba(0, 0, 0, 0.84) 268deg,
        rgba(0, 0, 0, 0) 268deg,
        rgba(0, 0, 0, 0) 300deg,
        rgba(0, 0, 0, 0.82) 300deg,
        rgba(0, 0, 0, 0.82) 322deg,
        rgba(0, 0, 0, 0) 322deg,
        rgba(0, 0, 0, 0) 360deg
      )
    `,
    filter: "blur(0.04px)",
    opacity: "0.95",
  };
}

function getPosteriorSubcapsularMaskConfig() {
  return {
    width: "44%",
    height: "44%",
    minWidth: "11px",
    minHeight: "11px",
    maxWidth: "23px",
    maxHeight: "23px",
    borderRadius: "48% 55% 57% 45% / 52% 48% 56% 44%",
    transform: "translate(-50%, -50%) rotate(-8deg)",
    background: `
      radial-gradient(
        ellipse 78% 74% at 50% 50%,
        rgba(38, 38, 38, 0.98) 0%,
        rgba(42, 42, 42, 0.92) 24%,
        rgba(48, 48, 48, 0.66) 44%,
        rgba(58, 58, 58, 0.3) 64%,
        rgba(58, 58, 58, 0) 82%
      ),
      radial-gradient(
        ellipse 26% 20% at 34% 36%,
        rgba(48, 48, 48, 0.66) 0%,
        rgba(52, 52, 52, 0.34) 34%,
        rgba(72, 72, 72, 0) 58%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 60%,
        rgba(46, 46, 46, 0.6) 0%,
        rgba(50, 50, 50, 0.3) 34%,
        rgba(66, 66, 66, 0) 58%
      )
    `,
    filter: "blur(0.9px)",
    opacity: "0.94",
  };
}

function getCentralMediaMaskConfig(flags) {
  if (flags.posteriorCapsularThickeningCase) {
    return getPosteriorCapsularThickeningMaskConfig();
  }

  if (flags.posteriorPoleCataractCase) {
    return getPosteriorPoleCataractMaskConfig();
  }

  if (flags.centralSubCorticalCataractCase) {
    return getPosteriorSubcapsularMaskConfig();
  }

  return null;
}

export function updateCentralMediaMask({ maskElement, flags, isActiveEye }) {
  if (!maskElement) {
    return;
  }

  const config = isActiveEye && getCentralMediaMaskConfig(flags);
  if (!config) {
    clearMask(maskElement);
    return;
  }

  applyMaskConfig(maskElement, config);
}
