export function buildPathologyOverlayVisual({
  flags,
  sweepX = 0,
  sweepY = 0,
  timeSec,
}) {
  if (
    !flags.floatersCase &&
    !flags.iridocyclitisKpsCase &&
    !flags.vitreousHaemorrhageCase &&
    !flags.partialRetinalDetachmentCase &&
    !flags.leucocoriaCase
  ) {
    return {
      background: "none",
      blurPx: 0,
      opacity: 0,
      transform: "none",
    };
  }

  if (flags.partialRetinalDetachmentCase) {
    return {
      background: `
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 1) 54%,
          rgba(0, 0, 0, 0.2) 54%,
          rgba(0, 0, 0, 0.2) 55.8%,
          rgba(0, 0, 0, 0) 56.2%
        ),
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 53.4%,
          rgba(0, 0, 0, 0.9) 53.4%,
          rgba(0, 0, 0, 0.9) 54.2%,
          rgba(0, 0, 0, 0) 55%
        )
      `,
      blurPx: 0,
      opacity: 0.98,
      transform: "none",
    };
  }

  if (flags.leucocoriaCase) {
    return {
      background: `
        radial-gradient(
          ellipse 17% 4.8% at 20% 42%,
          rgba(214, 28, 24, 0.92) 0%,
          rgba(214, 28, 24, 0.64) 44%,
          rgba(214, 28, 24, 0.24) 62%,
          rgba(142, 42, 42, 0) 76%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 34% 39%,
          rgba(220, 32, 26, 0.88) 0%,
          rgba(220, 32, 26, 0.6) 44%,
          rgba(220, 32, 26, 0.24) 62%,
          rgba(146, 46, 46, 0) 76%
        ),
        radial-gradient(
          ellipse 18% 4.8% at 49% 41%,
          rgba(226, 36, 28, 0.88) 0%,
          rgba(226, 36, 28, 0.58) 44%,
          rgba(226, 36, 28, 0.24) 62%,
          rgba(150, 48, 48, 0) 76%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 65% 44%,
          rgba(218, 30, 26, 0.84) 0%,
          rgba(218, 30, 26, 0.54) 44%,
          rgba(218, 30, 26, 0.22) 62%,
          rgba(146, 44, 44, 0) 76%
        ),
        radial-gradient(
          ellipse 15% 4% at 79% 46%,
          rgba(208, 26, 24, 0.76) 0%,
          rgba(208, 26, 24, 0.48) 42%,
          rgba(208, 26, 24, 0.2) 60%,
          rgba(142, 40, 40, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 18% 61%,
          rgba(212, 24, 22, 0.86) 0%,
          rgba(212, 24, 22, 0.58) 42%,
          rgba(212, 24, 22, 0.22) 60%,
          rgba(138, 38, 38, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 4.6% at 36% 58%,
          rgba(220, 28, 26, 0.84) 0%,
          rgba(220, 28, 26, 0.56) 42%,
          rgba(220, 28, 26, 0.22) 60%,
          rgba(144, 42, 42, 0) 74%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 55% 60%,
          rgba(224, 30, 28, 0.82) 0%,
          rgba(224, 30, 28, 0.52) 42%,
          rgba(224, 30, 28, 0.22) 60%,
          rgba(148, 46, 46, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4% at 73% 57%,
          rgba(210, 26, 26, 0.74) 0%,
          rgba(210, 26, 26, 0.46) 40%,
          rgba(210, 26, 26, 0.2) 58%,
          rgba(142, 40, 40, 0) 72%
        ),
        radial-gradient(
          ellipse 28% 20% at 36% 46%,
          rgba(224, 202, 110, 0.42) 0%,
          rgba(224, 202, 110, 0.24) 34%,
          rgba(224, 202, 110, 0.08) 58%,
          rgba(224, 202, 110, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 14% at 42% 50%,
          rgba(198, 174, 88, 0.36) 0%,
          rgba(198, 174, 88, 0.18) 38%,
          rgba(198, 174, 88, 0.06) 58%,
          rgba(198, 174, 88, 0) 76%
        ),
        radial-gradient(
          ellipse 20% 16% at 62% 46%,
          rgba(146, 138, 130, 0.52) 0%,
          rgba(146, 138, 130, 0.28) 34%,
          rgba(146, 138, 130, 0.08) 56%,
          rgba(146, 138, 130, 0) 74%
        ),
        radial-gradient(
          ellipse 13% 10% at 57% 53%,
          rgba(128, 120, 112, 0.42) 0%,
          rgba(128, 120, 112, 0.2) 34%,
          rgba(128, 120, 112, 0.06) 54%,
          rgba(128, 120, 112, 0) 72%
        ),
        radial-gradient(
          ellipse 12% 9% at 69% 40%,
          rgba(118, 112, 106, 0.36) 0%,
          rgba(118, 112, 106, 0.16) 34%,
          rgba(118, 112, 106, 0.04) 52%,
          rgba(118, 112, 106, 0) 70%
        ),
        radial-gradient(
          ellipse 20% 16% at 29% 34%,
          rgba(140, 130, 116, 0.54) 0%,
          rgba(140, 130, 116, 0.28) 32%,
          rgba(102, 102, 102, 0) 58%
        ),
        radial-gradient(
          ellipse 17% 14% at 68% 32%,
          rgba(148, 138, 122, 0.5) 0%,
          rgba(148, 138, 122, 0.24) 30%,
          rgba(112, 112, 112, 0) 56%
        ),
        radial-gradient(
          ellipse 18% 15% at 63% 69%,
          rgba(142, 132, 118, 0.48) 0%,
          rgba(142, 132, 118, 0.22) 30%,
          rgba(108, 108, 108, 0) 56%
        ),
        radial-gradient(
          ellipse 15% 12% at 44% 57%,
          rgba(152, 142, 126, 0.44) 0%,
          rgba(152, 142, 126, 0.22) 28%,
          rgba(118, 118, 118, 0) 52%
        ),
        radial-gradient(
          ellipse 24% 18% at 38% 42%,
          rgba(166, 154, 138, 0.4) 0%,
          rgba(166, 154, 138, 0.2) 30%,
          rgba(116, 116, 116, 0) 54%
        ),
        radial-gradient(
          ellipse 18% 14% at 62% 36%,
          rgba(174, 162, 146, 0.38) 0%,
          rgba(174, 162, 146, 0.18) 28%,
          rgba(136, 136, 136, 0) 50%
        ),
        radial-gradient(
          ellipse 22% 16% at 58% 64%,
          rgba(168, 156, 140, 0.36) 0%,
          rgba(168, 156, 140, 0.16) 30%,
          rgba(130, 130, 130, 0) 52%
        ),
        radial-gradient(
          ellipse 28% 22% at 34% 40%,
          rgba(196, 182, 160, 0.3) 0%,
          rgba(196, 182, 160, 0.14) 34%,
          rgba(156, 156, 156, 0) 58%
        ),
        radial-gradient(
          ellipse 22% 18% at 64% 34%,
          rgba(204, 190, 168, 0.26) 0%,
          rgba(204, 190, 168, 0.12) 30%,
          rgba(166, 166, 166, 0) 54%
        ),
        radial-gradient(
          ellipse 26% 20% at 58% 66%,
          rgba(188, 174, 154, 0.28) 0%,
          rgba(188, 174, 154, 0.12) 30%,
          rgba(146, 146, 146, 0) 54%
        ),
        radial-gradient(
          ellipse 20% 16% at 46% 54%,
          rgba(212, 198, 176, 0.18) 0%,
          rgba(212, 198, 176, 0.08) 28%,
          rgba(170, 170, 170, 0) 50%
        ),
        radial-gradient(
          ellipse 16% 14% at 72% 58%,
          rgba(192, 178, 158, 0.16) 0%,
          rgba(192, 178, 158, 0.08) 26%,
          rgba(156, 156, 156, 0) 48%
        ),
        radial-gradient(
          ellipse 88% 84% at 50% 50%,
          rgba(248, 238, 216, 0.64) 0%,
          rgba(236, 224, 198, 0.36) 26%,
          rgba(214, 200, 176, 0.12) 54%,
          rgba(194, 180, 156, 0.04) 82%,
          rgba(255, 248, 232, 0) 94%
        )
      `,
      blurPx: 0.09,
      opacity: 0.72,
      transform: "none",
    };
  }

  if (flags.iridocyclitisKpsCase) {
    return {
      background: `
        radial-gradient(ellipse 8.4% 8.4% at 10% 14%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 20% 24%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 8% 8% at 28% 12%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7% 7% at 40% 18%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.95) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.8% 7.8% at 54% 14%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.8% 6.8% at 58% 28%, rgba(0, 0, 0, 0.93) 0%, rgba(0, 0, 0, 0.93) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 16% 40%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.92) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.6% 6.6% at 34% 38%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 46%, rgba(0, 0, 0, 0) 68%)
      `,
      blurPx: 0.02,
      opacity: 0.88,
      transform: "none",
    };
  }

  if (flags.vitreousHaemorrhageCase) {
    return {
      background: `
        radial-gradient(
          ellipse 88% 78% at 50% 50%,
          rgba(0, 0, 0, 0.54) 0%,
          rgba(0, 0, 0, 0.3) 40%,
          rgba(0, 0, 0, 0.08) 74%,
          rgba(0, 0, 0, 0) 92%
        ),
        radial-gradient(
          ellipse 28% 24% at 30% 40%,
          rgba(0, 0, 0, 0.96) 0%,
          rgba(0, 0, 0, 0.96) 54%,
          rgba(0, 0, 0, 0.78) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 22% 18% at 66% 56%,
          rgba(0, 0, 0, 0.92) 0%,
          rgba(0, 0, 0, 0.92) 54%,
          rgba(0, 0, 0, 0.74) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 18% 14% at 54% 26%,
          rgba(0, 0, 0, 0.88) 0%,
          rgba(0, 0, 0, 0.88) 52%,
          rgba(0, 0, 0, 0.68) 68%,
          rgba(0, 0, 0, 0) 82%
        )
      `,
      blurPx: 0.08,
      opacity: 0.96,
      transform: "none",
    };
  }

  const driftX =
    Math.sin(timeSec * 0.32) * 2.2 + Math.cos(timeSec * 0.21 + 0.4) * 1.1;
  const driftY =
    Math.cos(timeSec * 0.28 + 0.7) * 1.7 + Math.sin(timeSec * 0.18 + 1.1) * 0.8;

  return {
    background: `
      radial-gradient(
        ellipse 13% 10% at 28% 38%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.84) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 7% 5% at 32% 35%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 54%,
        rgba(0, 0, 0, 0.76) 68%,
        rgba(0, 0, 0, 0) 80%
      ),
      radial-gradient(
        ellipse 11% 14% at 72% 62%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.82) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 6% 8% at 67% 58%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.94) 52%,
        rgba(0, 0, 0, 0.74) 66%,
        rgba(0, 0, 0, 0) 78%
      )
    `,
    blurPx: 0,
    opacity: 0.98,
    transform: `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px)`,
  };
}
