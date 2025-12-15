// Jest CJS mock for public/js/videoplayer.js to avoid ESM import issues in CI
// Minimal implementation that matches surfaces used by tests

function initializeVideoPlayers() {
  // Wire timeupdate on a known id if present
  const main =
    document.getElementById("customVideo") ||
    document.getElementById("trainingVideo");
  if (main && !main.__wiredTimeupdate) {
    main.__wiredTimeupdate = true;
    main.addEventListener("timeupdate", () => {});
  }

  // Ensure only one video plays at a time
  const videos = document.querySelectorAll("video");
  videos.forEach((v) => {
    if (v.__wiredPlayOnce) return;
    v.__wiredPlayOnce = true;
    v.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== v) other.pause();
      });
    });
  });
}

function seekTo() {}
function initializeToolbar() {}

module.exports = { initializeVideoPlayers, seekTo, initializeToolbar };
