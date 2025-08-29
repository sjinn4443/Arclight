export function initializeVideoPlayers() {
  // ensure only one video plays at a time
  const videos = document.querySelectorAll('video');
  videos.forEach(v => {
    v.addEventListener('play', () => {
      videos.forEach(other => { if (other !== v) other.pause(); });
    });
  });
}

export function initializeToolbar() {
  // placeholder for toolbar controls on pages that include them
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: handleVideoTimeUpdate

function handleVideoTimeUpdate() {
  const video = document.getElementById('customVideo');
  if (!video) return;

  const time = Math.floor(video.currentTime);
  const contentBox = document.getElementById('contentBox');

  const pauseEvents = {
    22: {
      id: 'eye-info',
      handler: () => {
        contentBox.innerHTML = `
          <h4>Eye Anatomy</h4>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Eye_anatomy_diagram.svg/1200px-Eye_anatomy_diagram.svg.png" style="width: 100%; border-radius: 5px; margin-top: 10px;" />
          <ul><li>Periorbita</li><li>Eyelids</li><li>Eyes</li></ul>`;
      }
    },
    32: {
      id: 'device-info',
      handler: () => {
        contentBox.innerHTML = `
          <h4>Arclight Device Overview</h4>
          <img src="images/arclight_device.png" style="width: 100%; border-radius: 5px;" />`;
      }
    }
  };

  if (pauseEvents[time] && lastPauseTime !== pauseEvents[time].id) {
    lastPauseTime = pauseEvents[time].id;
    video.pause();
    pauseEvents[time].handler();
    setTimeout(() => video.play(), 5000); // Auto-resume after 5 seconds
  }
}