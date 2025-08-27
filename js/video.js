// Custom video player and toolbar logic

// js/video.js (ES module)

/** Call once to wire the video toolbar and time-based content */
export function initializeVideo() {
  initializeToolbar();
  initializeVideoPlayers();
}

/* ----------------------------- Toolbar wiring ---------------------------- */

function initializeToolbar() {
  const map = {
    'timestampBtn': showTimestamps,
    'noteBtn':      showNote,
    'folderBtn':    showFiles,
    'infoBtn':      showDefaultInfo,
    'quizBtn':      () => {
      // Use existing quiz launcher if present; otherwise stub
      if (typeof window.launchQuiz === 'function') return window.launchQuiz();
      alert('Quiz module not loaded yet.');
    },
  };
  Object.entries(map).forEach(([id, handler]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  });
}

/* --------------------------- Time-based content -------------------------- */

let lastPauseTime = null;

function initializeVideoPlayers() {
  const video = document.getElementById('customVideo');
  if (video) video.addEventListener('timeupdate', handleVideoTimeUpdate);
}

function handleVideoTimeUpdate() {
  const video = document.getElementById('customVideo');
  if (!video) return;

  const time = Math.floor(video.currentTime);
  const contentBox = document.getElementById('contentBox');

  // Add/adjust events as needed
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
    setTimeout(() => video.play(), 5000);
  }
}

/* ------------------------------- Panels ---------------------------------- */

function setActiveToolbarButton(id) {
  document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(id);
  if (activeBtn) activeBtn.classList.add('active');
}

function showTimestamps() {
  setActiveToolbarButton('timestampBtn');
  const contentBox = document.getElementById('contentBox');
  contentBox.innerHTML = `
    <h4>Time stamp</h4>
    <p><a href="#" onclick="seekTo(0)">0:00 General Inspection</a></p>
    <p><a href="#" onclick="seekTo(28)">0:28 Arclight Setup</a></p>
    <p><a href="#" onclick="seekTo(47)">0:47 Fundal Reflex</a></p>
    <p><a href="#" onclick="seekTo(67)">1:07 Optic Nerve</a></p>
    <p><a href="#" onclick="seekTo(102)">1:42 Retinal Vessels</a></p>`;
}

function showNote() {
  setActiveToolbarButton('noteBtn');
  document.getElementById('contentBox').innerHTML =
    '<textarea placeholder="Type your notes here..."></textarea>';
}

function showFiles() {
  setActiveToolbarButton('folderBtn');
  document.getElementById('contentBox').innerHTML = `
    <h4>Attached Files</h4>
    <p><a class="link" href="#">Arclight_Device_Practice.pdf</a></p>
    <p><a class="link" href="#">Fundal_Reflex.pdf</a></p>
    <p><a class="link" href="#">Ophthalmoscopy_Exercise.docx</a></p>`;
}

function showDefaultInfo() {
  setActiveToolbarButton('infoBtn');
  document.getElementById('contentBox').innerHTML = `
    <h4>Additional Information</h4>
    <p>This video shows how to prepare and use the Arclight ophthalmoscope.</p>`;
}

/* ---------------------------- Inline helpers ----------------------------- */

// Keep this global because your timestamp links use inline onclick="seekTo(..)"
export function seekTo(sec) {
  const video = document.getElementById('customVideo');
  if (video) {
    video.currentTime = sec;
    video.play();
    lastPauseTime = null;
  }
}
// Also expose to window for existing inline HTML (safe no-op if duplicated)
window.seekTo = seekTo;
