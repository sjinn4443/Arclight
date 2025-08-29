function show(sectionId) {
  document.querySelectorAll('#page-content .page').forEach(p => p.style.display = 'none');
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';
}

export function initializeVideos() {
  // default to show the 'learningModules' hub
  if (document.getElementById('learningModules')) {
    show('learningModules');
  }

  const pc = document.getElementById('page-content');
  if (!pc) return;

  pc.addEventListener('click', (e) => {
    const dataTarget = e.target.closest('[data-page]');
    if (dataTarget) {
      show(dataTarget.getAttribute('data-page'));
      return;
    }
  });

  // top-level buttons
  const btnCore = document.getElementById('showCoreClinicalOphthalmicExaminationBtn');
  const btnDiseases = document.getElementById('showDiseasesBtn');
  const btnArclight = document.getElementById('showArclightBtn');

  if (btnCore) btnCore.onclick = () => show('coreClinicalOphthalmicExamination');
  if (btnDiseases) btnDiseases.onclick = () => show('diseasesPage');
  if (btnArclight) btnArclight.onclick = () => show('arclightPage');

  // some direct module cards
  const pupilsCard = document.getElementById('pupilsCard');
  const anteriorSegmentCard = document.getElementById('anteriorSegmentCard');
  const ophthalmoscopyCard = document.getElementById('ophthalmoscopyCard');
  const interactiveLearningCard = document.getElementById('interactiveLearningCard');
  const visualAcuityCard = document.getElementById('visualacuityCard');

  if (visualAcuityCard) visualAcuityCard.onclick = () => show('visualAcuityPage');
  if (pupilsCard) pupilsCard.onclick = () => show('pupilsPage');
  if (anteriorSegmentCard) anteriorSegmentCard.onclick = () => show('frontOfEyePage');
  if (ophthalmoscopyCard) ophthalmoscopyCard.onclick = () => show('directOphthalmoscopy');
  if (interactiveLearningCard) interactiveLearningCard.onclick = () => show('interactiveLearningPage');
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeVideoPlayers, handleVideoTimeUpdate, seekTo, showTimestamps, showNote, showFiles, showDefaultInfo, launchQuiz, initializeToolbar, setActiveToolbarButton

function initializeVideoPlayers() {
  const video = document.getElementById('customVideo');
  if (video) {
    video.addEventListener('timeupdate', handleVideoTimeUpdate);
  }
}

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

function seekTo(sec) {
  const video = document.getElementById('customVideo');
  if (video) {
    video.currentTime = sec;
    video.play();
    lastPauseTime = null; // Reset pause tracking
  }
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
  document.getElementById('contentBox').innerHTML = '<textarea placeholder="Type your notes here..."></textarea>';
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

function launchQuiz() {
  const previousPage = document.querySelector('.page.active')?.id || 'dashboard';
  const quizPageId = 'directOphthalmoscopyQuizPage';

  // Avoid creating duplicate quiz pages
  if (document.getElementById(quizPageId)) {
    showPage(quizPageId);
    return;
  }

  const quizPage = document.createElement('div');
  quizPage.id = quizPageId;
  quizPage.className = 'page';
  quizPage.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header small">
        <div class="quiz-header-row centered">
          <button id="backToVideoBtn" class="back-icon" title="Go back">←</button>
          <h2>Quiz</h2>
        </div>
      </div>
      <div class="quiz-scroll"><form id="quizForm"></form></div>
      <div class="quiz-footer">
        <button type="submit" form="quizForm" class="start-btn">See Results</button>
      </div>
      <div id="quizModal" class="quiz-modal hidden">
        <div class="quiz-modal-content">
          <p id="quizScoreText"></p>
          <button id="seeWhyBtn">See why?</button>
        </div>
      </div>
    </div>`;
  document.getElementById('appRoot').appendChild(quizPage);

  const questions = [
    { q: "1. When starting direct ophthalmoscopy, what is the ideal distance between the examiner and the patient?", options: ["5 cm", "10 cm", "15 cm", "Arm’s length"], answer: 3 },
    { q: "2. Which of the options describe the best condition to get the view of the retina?", options: ["Outdoors with bright sunlight, dilated pupil", "Deem room with dilated pupil", "Indoors with bright light, dilated pupil", "Deem room with constricted pupil"], answer: 1 },
    { q: "3. Which eye should you use to examine the patient’s right eye?", options: ["Left eye", "Either eye", "Right eye", "Dominant eye"], answer: 2 },
    { q: "4. During ophthalmoscopy, which part of the back of the eye should you identify first?", options: ["Macula", "Optic disc", "Retinal periphery", "Fovea"], answer: 1 },
    { q: "5. What is the name given to pale optic disc?", options: ["Normal finding", "Cataract", "Optic atrophy", "Raised intraocular pressure"], answer: 2 },
    { q: "6. Which lighting condition is recommended for performing ophthalmoscopy with the Arclight?", options: ["Bright daylight", "Dim or darkened room", "Bright room", "Ambient light"], answer: 1 },
    { q: "7. What does a cup-to-disc ratio (CDR) of 0.7 or greater typically suggest on fundus examination?", options: ["Glaucoma", "Macular degeneration", "Diabetic retinopathy", "Retinal detachment"], answer: 0 }
  ];

  const quizForm = quizPage.querySelector('#quizForm');
  questions.forEach((q, i) => {
    let block = `<div class="quiz-block"><p>${q.q}</p>`;
    q.options.forEach((opt, j) => {
      block += `<label class="radio-label"><input type="radio" name="q${i}" value="${j}" /><span>${opt}</span></label>`;
    });
    block += `<p class="answer" style="display:none; margin-top:5px; font-style:italic;">Correct answer: ${q.options[q.answer]}</p></div>`;
    quizForm.innerHTML += block;
  });

  quizForm.onsubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => {
      const radios = quizForm.querySelectorAll(`input[name="q${i}"]`);
      const answer = q.answer;
      let selected = null;
      radios.forEach(r => {
        r.disabled = true;
        if (r.checked) selected = parseInt(r.value);
      });
      const labels = radios[0].closest('.quiz-block').querySelectorAll('label');
      labels.forEach((label, index) => {
        if (index === answer) label.classList.add('correct');
        else if (parseInt(label.querySelector('input').value) === selected) label.classList.add('wrong');
      });
      if (selected === answer) correct++;
    });
    quizPage.querySelector('#quizScoreText').innerText = `You got ${correct} out of ${questions.length} correct.`;
    quizPage.querySelector('#quizModal').classList.remove('hidden');
  };

  quizPage.querySelector('#seeWhyBtn').addEventListener('click', () => {
    quizPage.querySelector('#quizModal').classList.add('hidden');
    quizPage.querySelectorAll('.answer').forEach(a => a.style.display = 'block');
  });

  quizPage.querySelector('#backToVideoBtn').addEventListener('click', () => {
    showPage(previousPage);
  });

  showPage(quizPageId);
}

function initializeToolbar() {
  const toolbarButtonMappings = {
    'timestampBtn': showTimestamps,
    'noteBtn': showNote,
    'folderBtn': showFiles,
    'infoBtn': showDefaultInfo,
    'quizBtn': launchQuiz,
  };

  for (const [btnId, handler] of Object.entries(toolbarButtonMappings)) {
    const button = document.getElementById(btnId);
    if (button) button.addEventListener('click', handler);
  }
}

function setActiveToolbarButton(id) {
  document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(id);
  if (activeBtn) activeBtn.classList.add('active');
}