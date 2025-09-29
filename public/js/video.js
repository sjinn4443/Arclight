/**
 * @fileoverview This file manages video player functionalities, including ensuring single video playback, handling time-based content updates, and initializing interactive toolbars.
 */

let lastPauseTime = null;

async function handleQuizClick() {
  // If an old global exists, use it
  if (typeof window.launchQuiz === "function") {
    return window.launchQuiz();
  }

  // Otherwise, navigate to the quiz page directly
  try {
    if (typeof loadPage === "function") {
      await loadPage("quizzes"); // ensure quizzes fragment is loaded
    }
    if (typeof window.showPage === "function") {
      window.showPage("anteriorSegmentQuizPage");
    } else if (typeof minimalShowPage === "function") {
      minimalShowPage("anteriorSegmentQuizPage");
    }
  } catch (err) {
    console.error("Failed to launch quiz:", err);
  }
}

export function seekTo(sec) {
  const video = document.getElementById("customVideo");
  if (video) {
    video.currentTime = sec;
    video.play();
    lastPauseTime = null; // reset pause tracking
  }
}

export function initializeVideoPlayers() {
  // Attach contextual timeupdate to the Direct Ophthalmoscopy video
  const main = document.getElementById("customVideo");
  if (main && !main.__wiredTimeupdate) {
    main.__wiredTimeupdate = true;
    main.addEventListener("timeupdate", handleVideoTimeUpdate);
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

export function initializeToolbar() {
  const toolbarButtonMappings = {
    timestampBtn: showTimestamps,
    noteBtn: showNote,
    folderBtn: showFiles,
    infoBtn: showDefaultInfo,
    quizBtn: handleQuizClick,
  };

  for (const [btnId, handler] of Object.entries(toolbarButtonMappings)) {
    const button = document.getElementById(btnId);
    if (button && !button.__wired) {
      button.__wired = true;
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const video = document.getElementById("customVideo");
        if (video) video.pause(); // pause first
        handler(); // then run the action
      });
    }
  }
}

function showTimestamps() {
  setActiveToolbarButton("timestampBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;

  contentBox.innerHTML = `
    <h4>Time stamp</h4>
    <p><a href="#" data-ts="0">0:00 General Inspection</a></p>
    <p><a href="#" data-ts="28">0:28 Arclight Setup</a></p>
    <p><a href="#" data-ts="47">0:47 Fundal Reflex</a></p>
    <p><a href="#" data-ts="67">1:07 Optic Nerve</a></p>
    <p><a href="#" data-ts="102">1:42 Retinal Vessels</a></p>`;

  contentBox.querySelectorAll("[data-ts]").forEach((a) => {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const sec = parseInt(a.getAttribute("data-ts"), 10) || 0;
      seekTo(sec);
    });
  });
}

function showNote() {
  setActiveToolbarButton("noteBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML =
    '<textarea placeholder="Type your notes here..."></textarea>';
}

function showFiles() {
  setActiveToolbarButton("folderBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML = `
    <h4>Attached Files</h4>
    <p><a class="link" href="#">Arclight_Device_Practice.pdf</a></p>
    <p><a class="link" href="#">Fundal_Reflex.pdf</a></p>
    <p><a class="link" href="#">Ophthalmoscopy_Exercise.docx</a></p>`;
}

function showDefaultInfo() {
  setActiveToolbarButton("infoBtn");
  const contentBox = document.getElementById("contentBox");
  if (!contentBox) return;
  contentBox.innerHTML = `
    <h4>Additional Information</h4>
    <p>This video shows how to prepare and use the Arclight ophthalmoscope.</p>`;
}

function setActiveToolbarButton(id) {
  document
    .querySelectorAll(".toolbar button")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.getElementById(id);
  if (activeBtn) activeBtn.classList.add("active");
}

// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: handleVideoTimeUpdate

function handleVideoTimeUpdate() {
  const video = document.getElementById("customVideo");
  if (!video) return;

  const time = Math.floor(video.currentTime);
  const contentBox = document.getElementById("contentBox");

  const pauseEvents = {
    22: {
      id: "eye-info",
      handler: () => {
        contentBox.innerHTML = `
          <h4>Eye Anatomy</h4>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Eye_anatomy_diagram.svg/1200px-Eye_anatomy_diagram.svg.png" style="width: 100%; border-radius: 5px; margin-top: 10px;" />
          <ul><li>Periorbita</li><li>Eyelids</li><li>Eyes</li></ul>`;
      },
    },
    32: {
      id: "device-info",
      handler: () => {
        contentBox.innerHTML = `
          <h4>Arclight Device Overview</h4>
          <img src="images/learning/arclight_device.webp" style="width: 100%; border-radius: 5px;" />`;
      },
    },
  };

  if (pauseEvents[time] && lastPauseTime !== pauseEvents[time].id) {
    lastPauseTime = pauseEvents[time].id;
    video.pause();
    pauseEvents[time].handler();
    setTimeout(() => video.play(), 5000); // Auto-resume after 5 seconds
  }
}
