document.addEventListener('DOMContentLoaded', function() {
  // --------------------------------------------------------
  // 1. Toggle History Section Radio Buttons
  // --------------------------------------------------------
  const historyRadios = document.querySelectorAll('#top-section input[type="radio"]');
  historyRadios.forEach(radio => {
    radio.addEventListener('mousedown', function() {
      // Save current state before click.
      this.wasChecked = this.checked;
    });
    radio.addEventListener('click', function() {
      // If already checked, toggle off.
      if (this.wasChecked) {
        this.checked = false;
      }
      this.wasChecked = false;
      updateCriticalStyling();
      calculateResult();
    });
  });

  // --------------------------------------------------------
  // 2. Enable Fundal Section When Required Fields Are Complete
  //    and Show a Temporary Animated Message
  // --------------------------------------------------------
  function checkTopSectionCompletion() {
    const onsetSelected = document.querySelector('#top-section input[name="onset"]:checked');
    const distanceVA = document.getElementById('distanceVA').value;
    return onsetSelected && distanceVA !== "";
  }

  const topInputs = document.querySelectorAll('#top-section input, #top-section select');
  topInputs.forEach(input => {
    input.addEventListener('change', function() {
      const fundalSection = document.getElementById('fundal-section');
      if (checkTopSectionCompletion()) {
        const wasDisabled = fundalSection.classList.contains('disabled');
        fundalSection.classList.remove('disabled');
        if (wasDisabled) {
          const fundalTitle = fundalSection.querySelector('h2');
          if (fundalTitle) {
            const message = document.createElement('span');
            message.textContent = 'Dilate pupils for best view';
            message.style.color = 'black';
            message.style.fontSize = '14px';
            message.style.marginLeft = '20px';
            message.style.display = 'inline-block';
            message.id = 'fundal-message';
            message.style.animation = 'zoomAnimation 4s forwards';
            fundalTitle.appendChild(message);
            setTimeout(() => {
              message.remove();
            }, 4000);
          }
        }
      } else {
        document.getElementById('fundal-section').classList.add('disabled');
      }
      calculateResult();
    });
  });

  // --------------------------------------------------------
  // 3. Fundal Reflex Button Events
  // --------------------------------------------------------
  const fundalButtons = document.querySelectorAll('.fundal-btn');
  fundalButtons.forEach(button => {
    button.addEventListener('click', function() {
      fundalButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = "#ccc";
      });
      this.classList.add('selected');
      const val = this.getAttribute("data-value").trim();
      if (val === "normal") {
        this.style.borderColor = "green";
      } else if (val === "dark" || val === "patches" || val === "spots") {
        this.style.borderColor = "orange";
      } else if (val === "white") {
        this.style.borderColor = "red";
        // Automatically select the back-of-eye button for "poor view".
        const poorViewBtn = document.querySelector('.back-btn[data-value="poor view"]');
        if (poorViewBtn) {
          const backButtons = document.querySelectorAll('.back-btn');
          backButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.borderColor = "#ccc";
          });
          poorViewBtn.classList.add('selected');
          poorViewBtn.style.borderColor = "orange";
          document.getElementById('back-section').classList.add('disabled');
        }
      } else {
        this.style.borderColor = "#ccc";
      }
      if (val !== "white") {
        document.getElementById('back-section').classList.remove('disabled');
      }
      calculateResult();
    });
  });

  // --------------------------------------------------------
  // 4. Back of Eye Button Events
  // --------------------------------------------------------
  const backButtons = document.querySelectorAll('.back-btn');
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (document.getElementById('back-section').classList.contains('disabled')) {
        return;
      }
      backButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = "#ccc";
      });
      this.classList.add('selected');
      const val = this.getAttribute("data-value").trim();
      if (val === "normal") {
        this.style.borderColor = "green";
      } else if (val === "detached") {
        this.style.borderColor = "red";
      } else if (val === "cupping" || val === "diabetic" || val === "poor view") {
        this.style.borderColor = "orange";
      } else {
        this.style.borderColor = "#ccc";
      }
      calculateResult();
    });
  });

  // --------------------------------------------------------
  // 5. Calculate and Display the Result (LOGIC)
  // --------------------------------------------------------
  function calculateResult() {
    // Ensure an onset option is selected.
    const onsetElem = document.querySelector('#top-section input[name="onset"]:checked');
    if (!onsetElem) {
      document.getElementById('result').innerHTML = "";
      return;
    }
    // Ensure both fundal and back selections exist.
    const fundalBtn = document.querySelector('.fundal-btn.selected');
    const backBtn = document.querySelector('.back-btn.selected');
    if (!fundalBtn || !backBtn) {
      document.getElementById('result').innerHTML = "";
      return;
    }
    const fundalSelection = fundalBtn.getAttribute('data-value');
    const backSelection = backBtn.getAttribute('data-value');
    // Normalise the near VA value.
    const nearVAValue = document.getElementById('nearVA').value.trim().toUpperCase();
    // Retrieve the distance VA value.
    const distanceVA = document.getElementById('distanceVA').value;
    
    // 1. Determine Cataract Type.
    let cataractType = "";
    if (fundalSelection === "normal") {
      cataractType = "Normal";
    } else if (fundalSelection === "white") {
      cataractType = "Mature";
    } else if (fundalSelection === "dark") {
      cataractType = "Nuclear";
    } else if (fundalSelection === "patches") {
      cataractType = "Cortical";
    } else if (fundalSelection === "spots") {
      cataractType = "Subcapsular";
    }
    
    // 2. Base Referral from Fundal & Back findings.
    let referral = "";
    if (fundalSelection === "normal") {
      referral = "NO (Not needed)";
      cataractType = "Nil";
    } else if (backSelection === "normal") {
      referral = "YES (Routine surgery)";
    } else if (backSelection === "poor view") {
      referral = "NO (Not needed)";
    } else {
      referral = "YES (Routine surgery)";
    }
    
    // 3. Special rule for white fundal.
    if (fundalSelection === "white" && !["cupping", "diabetic", "detached"].includes(backSelection)) {
      referral = "YES (Priority surgery)";
    }
    
    // 4. Distance VA Overrides.
    if (distanceVA === "HM" || distanceVA === "6/60") {
      referral = "YES (Priority surgery) - Dist VA very poor";
    } else if (distanceVA === "6/36") {
      referral = "YES (Routine surgery) - Dist VA poor";
    } else if (distanceVA === "6/12") {
      referral = "See in 12 mths - Dist VA";
    } else if (distanceVA === "6/6") {
      referral = "NO (Not needed) - VA OK";
      cataractType = "Nil";
    }
    
    // 5. Near VA Consideration (simplified)
    // N8: "Near VA is slightly reduced", N12: "Near VA is reduced",
    // N18: "Near VA is poor", N36: "Near VA is very poor"
    if (nearVAValue && nearVAValue !== "N5") {
      let nearVAComment = "";
      switch (nearVAValue) {
        case "N8":
          nearVAComment = "Near VA is slightly reduced";
          break;
        case "N12":
          nearVAComment = "Near VA is reduced";
          break;
        case "N18":
          nearVAComment = "Near VA is poor";
          break;
        case "N36":
          nearVAComment = "Near VA is very poor";
          break;
      }
      if (nearVAComment) {
        referral += " - " + nearVAComment;
      }
    }
    
    // 6. One Eye & Sudden Onset with Pain.
    const eyesElem = document.querySelector('#top-section input[name="eyes"]:checked');
    const eyes = eyesElem ? eyesElem.value : "";
    const onsetValue = onsetElem.value;
    const painYes = document.getElementById('pain-yes').checked;
    if (eyes === "one" && onsetValue === "sudden" && painYes) {
      referral = "YES (Refer urgently for surgery) - Sudden onset, pain, ?acute glaucoma/other";
      if (cataractType !== "Nil") {
        cataractType = "Possible Cataract, ?other";
      }
    }
    
    // 7. Pupil & Front-of-Eye Overrides.
    const pupilRadio = document.getElementById('pupil-normal');
    const pupilSelected = document.querySelector('#top-section input[name="pupil"]:checked');
    // If no pupil option is selected OR the selected option is not the 'normal' one,
    // flag an abnormal pupil.
    if (!pupilSelected || !pupilRadio.checked) {
      referral = "YES - Pupils = advanced/complex disease";
      if (cataractType !== "Nil") {
        cataractType = "YES";
      }
    }
    if (document.getElementById('front-present').checked) {
      referral = "YES but guarded outcome - Front of eye issue";
    }
    
    // 8. Urgent Investigation Flag.
    let urgentFlag = false;
    let investigationMessage = "";
    let investigationColor = "";
    const onsetSudden = document.getElementById('onset-sudden').checked;
    const oneEyeStatus = (document.querySelector('#top-section input[name="eyes"]:checked')?.value === "one");
    // If sudden onset is selected OR (pain is present AND one-eye is selected),
    // then it's urgent.
    if (onsetSudden || (painYes && oneEyeStatus)) {
      urgentFlag = true;
      investigationMessage = "Urgent: Investigation needed";
      investigationColor = "red";
    } else if (painYes) {
      urgentFlag = true;
      investigationMessage = "Soon: Investigation";
      investigationColor = "orange";
    }
    
    // Final override: if cupping, diabetic or detached then referral is NO.
    if (["cupping", "diabetic", "detached"].includes(backSelection)) {
      referral = "NO (Not suitable) - Back of eye disease";
    }
    
    // 9. Build the result output.
    const resultDiv = document.getElementById('result');
    let resultHTML = `<p><strong>Cataract:</strong> ${cataractType}</p>`;
    
    if (referral.startsWith("YES (Refer urgently")) {
      resultHTML += `<p><strong>>:</strong> <span style="color:red;">YES</span>${referral.substring(3)}</p>`;
    } else if (referral.startsWith("YES (Refer")) {
      resultHTML += `<p><strong>>:</strong> <span style="color:green;">YES</span>${referral.substring(3)}</p>`;
    } else if (referral.startsWith("See") || referral.startsWith("Soon")) {
      resultHTML += `<p style="color:orange;"><strong>>:</strong> <span style="color:orange;">${referral.split(' ')[0]}</span> ${referral.substring(referral.indexOf(' ') + 1)}</p>`;
    } else if (referral.startsWith("YES - Pupils")) {
      // Output the pupil override message in orange.
      resultHTML += `<p style="color:orange;"><strong>>:</strong> ${referral}</p>`;
    } else if (referral.startsWith("NO")) {
      resultHTML += `<p><strong>>:</strong> ${referral}</p>`;
    } else if (referral.startsWith("Incomplete Data")) {
      resultHTML += `<p style="color:grey;"><strong>>:</strong> <span style="color:grey;">${referral}</span></p>`;
    } else {
      resultHTML += `<p><strong>>:</strong> ${referral}</p>`;
    }
    resultHTML += `<br>`;
    
    let explanationCataract = "";
    let explanationBack = "";
    if (cataractType !== "Nil") {
      if (cataractType === "Nuclear") {
        explanationCataract += `<p>Nuclear: dense central opacity causing blur; usually age-related and progressive; surgery will help.</p>`;
      } else if (cataractType === "Cortical") {
        explanationCataract += `<p>Cortical: spoke-like peripheral opacities cause blur and glare; surgery will help.</p>`;
      } else if (cataractType === "Subcapsular") {
        explanationCataract += `<p>Subcapsular: posterior opacities cause glare and reduced near vision; surgery will help.</p>`;
      } else if (cataractType === "Mature") {
        explanationCataract += `<p>Mature: opaque white lens and severe vision loss; prompt surgery will prevent complications.</p>`;
      }
    }
    if (["cupping", "diabetic", "poor view", "detached"].includes(backSelection)) {
      if (backSelection === "cupping") {
        explanationBack += `<p>Deep disc cupping indicates advanced glaucoma. Swift evaluation is needed to protect vision.</p>`;
      } else if (backSelection === "diabetic") {
        explanationBack += `<p>Diabetic retinopathy needs treatment to save vision. Cataract surgery is unlikely to help.</p>`;
      } else if (backSelection === "poor view") {
        explanationBack += `<p>Poor view from dense cataract, retinal detachment or vitreous haemorrhage. Further evaluation is needed.</p>`;
      } else if (backSelection === "detached") {
        explanationBack += `<p>A fresh retinal detachment requires immediate repair. If longstanding, cataract surgery is unlikely to help.</p>`;
      }
    }
    
    let combinedExplanation = explanationCataract;
    if (explanationCataract && explanationBack) {
      combinedExplanation += `<br>` + explanationBack;
    } else {
      combinedExplanation += explanationBack;
    }
    if (combinedExplanation) {
      resultHTML += `<div class="explanation-text">${combinedExplanation}</div>`;
    }
    if (urgentFlag && investigationMessage) {
      resultHTML += `<p style="color:${investigationColor};"><strong>${investigationMessage.split(':')[0]}:</strong> ${investigationMessage.split(':')[1].trim()}</p>`;
    }
    resultDiv.innerHTML = resultHTML;
    document.getElementById('result-section').classList.remove('disabled');
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
  }

  // --------------------------------------------------------
  // 6. Update Critical Styling Based on Selections
  // --------------------------------------------------------
  function updateCriticalStyling() {
    // "Sudden" vision loss → red (serious)
    const suddenRadio = document.getElementById('onset-sudden');
    if (suddenRadio) {
      const suddenSpan = suddenRadio.parentElement;
      if (suddenRadio.checked) {
        suddenSpan.classList.add('serious');
      } else {
        suddenSpan.classList.remove('serious');
      }
    }
    // "Pain/Red" → red (serious)
    const painRadio = document.getElementById('pain-yes');
    const painLabel = document.getElementById('pain-label');
    if (painRadio && painLabel) {
      if (painRadio.checked) {
        painLabel.classList.add('serious');
      } else {
        painLabel.classList.remove('serious');
      }
    }
    // "Pupil: black, round, equal, reacts" – ensure label stays black until selection,
    // but if NOT clicked, give a warning (handled in referral output).
    const pupilRadio = document.getElementById('pupil-normal');
    const pupilLabel = document.getElementById('pupil-label');
    const pupilSelected = document.querySelector('#top-section input[name="pupil"]:checked');
    if (pupilLabel) {
      if (!pupilSelected) {
        // No selection – leave label unchanged (black).
        pupilLabel.classList.remove('good');
        pupilLabel.classList.remove('serious');
      } else {
        if (pupilRadio.checked) {
          // Normal option selected – label turns green.
          pupilLabel.classList.add('good');
          pupilLabel.classList.remove('serious');
        } else {
          // Abnormal option selected – label remains black.
          pupilLabel.classList.remove('good');
          pupilLabel.classList.remove('serious');
        }
      }
    }
    // "Front of Eye: scarring or distortion seen" → orange (warning)
    const frontRadio = document.getElementById('front-present');
    const frontLabel = document.getElementById('front-label');
    if (frontRadio && frontLabel) {
      if (frontRadio.checked) {
        frontLabel.classList.add('warning');
      } else {
        frontLabel.classList.remove('warning');
      }
    }
  }

  // --------------------------------------------------------
  // 7. Image Popup on Long Press
  // --------------------------------------------------------
  const popupDelay = 500;
  let popupTimer;
  function showImagePopup(button) {
    let popup = document.getElementById('image-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'image-popup';
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.zIndex = '1000';
      popup.style.backgroundColor = '#fff';
      popup.style.border = '2px solid #ccc';
      popup.style.borderRadius = '20px';
      popup.style.padding = '10px';
      popup.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
      document.body.appendChild(popup);
    }
    popup.innerHTML = '';
    const img = button.querySelector('img');
    if (img) {
      const enlargedImg = img.cloneNode(true);
      enlargedImg.draggable = false;
      enlargedImg.addEventListener('contextmenu', e => e.preventDefault());
      enlargedImg.style.maxWidth = '80vw';
      enlargedImg.style.height = 'auto';
      enlargedImg.style.display = 'block';
      enlargedImg.style.animation = 'zoomImage 3s forwards';
      popup.appendChild(enlargedImg);
      popup.style.display = 'block';
    }
  }
  function hideImagePopup() {
    clearTimeout(popupTimer);
    const popup = document.getElementById('image-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }
  const buttons = document.querySelectorAll('.button-item button');
  buttons.forEach(button => {
    button.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
    button.addEventListener('mousedown', function() {
      popupTimer = setTimeout(() => showImagePopup(button), popupDelay);
    });
    button.addEventListener('mouseup', hideImagePopup);
    button.addEventListener('mouseleave', hideImagePopup);
    button.addEventListener('touchstart', function() {
      popupTimer = setTimeout(() => showImagePopup(button), popupDelay);
    });
    button.addEventListener('touchend', hideImagePopup);
    button.addEventListener('touchcancel', hideImagePopup);
  });

  // Add event listener for nearVA input if needed.
  const nearVAInput = document.getElementById('nearVA');
  if (nearVAInput) {
    nearVAInput.addEventListener('change', calculateResult);
  }
});
