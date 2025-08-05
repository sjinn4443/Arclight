/**
 * Squint Project – Main JavaScript File
 *
 * Implements:
 * - Draggable iris elements with constrained movement
 * - Pupil size slider (snap-to-centre functionality)
 * - Fade button for faded iris overlay
 * - Reflex mode toggle (forcing iris to black and adjusting pupil brightness)
 * - Iris colour selection (when not in reflex mode)
 * - Micro saccades and continuous background jitter
 * - Upper eyelid ptosis simulation via a vertical slider
 * - Blink simulation that temporarily closes the eye (overriding ptosis)
 * - Reflex colour slider that sets the base reflex colour, with pupil brightness adjusting relative to that colour
 * - Sudden toggle that changes its label colour when active
 * - Output logic for displaying eye orientation
 */

// -----------------------------
// Global Variables
// -----------------------------
// Base reflex colour (default is orange, but stored in a dulled state)
let baseReflexColor = {
  r: Math.round(218 * 0.7),
  g: Math.round(58 * 0.7),
  b: Math.round(0 * 0.7)
};

// -----------------------------
// Helper Functions
// -----------------------------
/**
 * Parse an "rgb(r, g, b)" string and return an object with r, g and b components.
 * Returns { r: 0, g: 0, b: 0 } if parsing fails.
 */
function parseRGB(rgbStr) {
  const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgbStr);
  if (result) {
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10)
    };
  }
  return { r: 0, g: 0, b: 0 };
}

/**
 * Brighten a colour by multiplying its channels by a factor.
 * Each channel is clamped to a maximum of 255.
 */
function brightenColor(color, factor) {
  return {
    r: Math.min(Math.round(color.r * factor), 255),
    g: Math.min(Math.round(color.g * factor), 255),
    b: Math.min(Math.round(color.b * factor), 255)
  };
}

// -----------------------------
// Core Functionality
// -----------------------------
/**
 * Update the iris transform using its micro saccade and background jitter offsets.
 * This function combines both offsets and sets the CSS transform property.
 */
function updateIrisTransform(iris) {
  const totalX = (iris.microOffset?.x || 0) + (iris.backgroundOffset?.x || 0);
  const totalY = (iris.microOffset?.y || 0) + (iris.backgroundOffset?.y || 0);
  iris.style.transform = `translate(${totalX}px, ${totalY}px)`;
}

// -----------------------------
// Output Logic Functions
// -----------------------------
/**
 * Compute the current displacement of the iris relative to its eye centre,
 * then call updateEyeOutput() to update the displayed output.
 */
function updateOutputForEye(eye) {
  const iris = eye.querySelector('.iris');
  if (!iris) return;
  const eyeRect = eye.getBoundingClientRect();
  const irisRect = iris.getBoundingClientRect();
  const eyeCentreX = eyeRect.left + eyeRect.width / 2;
  const eyeCentreY = eyeRect.top + eyeRect.height / 2;
  const irisCentreX = irisRect.left + irisRect.width / 2;
  const irisCentreY = irisRect.top + irisRect.height / 2;
  const dx = irisCentreX - eyeCentreX;
  const dy = irisCentreY - eyeCentreY;
  updateEyeOutput(eye, dx, dy);
}

/**
 * Build and display a textual description of the eye's status.
 * The output includes iris position, eyelid ptosis, pupil size,
 * fade state and extra info for reflex mode or sudden toggle.
 */
function updateEyeOutput(eye, dx, dy) {
  const neutralThreshold = 3;
  let irisPosition = "";
  let ptosisOutput = "";
  let pupilOutput = "";
  let fadeOutput = "";
  const eyeType = eye.getAttribute("data-eye");
  const eyeID = eye.id;

  // ----- Iris Position -----
  const absDx = Math.abs(dx);
  let horizontalGrade = "";
  if (absDx > neutralThreshold && absDx <= 10) {
    horizontalGrade = "small ";
  } else if (absDx > 10 && absDx <= 20) {
    horizontalGrade = "medium ";
  } else if (absDx > 20) {
    horizontalGrade = "large ";
  }
  let horizontal = "";
  if (eyeType === "left" || eyeID === "left-eye") {
    if (dx > neutralThreshold) {
      horizontal = horizontalGrade + "in";
    } else if (dx < -neutralThreshold) {
      horizontal = horizontalGrade + "out";
    }
  } else if (eyeType === "right" || eyeID === "right-eye") {
    if (dx < -neutralThreshold) {
      horizontal = horizontalGrade + "in";
    } else if (dx > neutralThreshold) {
      horizontal = horizontalGrade + "out";
    }
  }

  const absDy = Math.abs(dy);
  let verticalGrade = "";
  if (absDy > neutralThreshold && absDy <= 10) {
    verticalGrade = "small ";
  } else if (absDy > 10 && absDy <= 20) {
    verticalGrade = "med ";
  } else if (absDy > 20) {
    verticalGrade = "large ";
  }
  let vertical = "";
  if (dy < -neutralThreshold) {
    vertical = verticalGrade + "up";
  } else if (dy > neutralThreshold) {
    vertical = verticalGrade + "down";
  }
  if (horizontal || vertical) {
    irisPosition = (horizontal && vertical) ? horizontal + " and " + vertical : (horizontal || vertical);
  }

  // ----- Upper Eyelid Ptosis -----
  let lidSlider = document.querySelector(`.vertical-eye-slider[data-eye="${eyeType}"]`);
  if (lidSlider) {
    let sliderValue = parseFloat(lidSlider.value);
    if (sliderValue > neutralThreshold) {
      if (sliderValue > neutralThreshold && sliderValue <= 10) {
        ptosisOutput = "small ptosis";
      } else if (sliderValue > 10 && sliderValue <= 20) {
        ptosisOutput = "med ptosis";
      } else if (sliderValue > 20) {
        ptosisOutput = "large ptosis";
      }
    }
  }

  // ----- Pupil Size -----
  let pupilSlider = document.querySelector(`.slider[data-eye="${eyeType}"]`);
  const defaultPupil = 32;
  if (pupilSlider) {
    let pupilValue = parseFloat(pupilSlider.value);
    let diff = pupilValue - defaultPupil;
    let absDiff = Math.abs(diff);
    if (absDiff > 3) { // Only report if the difference is significant
      if (absDiff > 3 && absDiff <= 8) {
        pupilOutput = diff < 0 ? "slightly smaller pupil" : "slightly larger pupil";
      } else if (absDiff > 8 && absDiff <= 15) {
        pupilOutput = diff < 0 ? "smaller pupil" : "larger pupil";
      } else if (absDiff > 15) {
        pupilOutput = diff < 0 ? "pinhole pupil" : "dilated pupil";
      }
    }
  }

  // ----- Faded Iris -----
  let irisElement = eye.querySelector(".iris");
  if (irisElement && irisElement.classList.contains("faded")) {
    fadeOutput = "faded";
  }

  // Combine the basic outputs
  let outputs = [];
  if (irisPosition) outputs.push(irisPosition);
  if (ptosisOutput) outputs.push(ptosisOutput);
  if (pupilOutput) outputs.push(pupilOutput);
  if (fadeOutput) outputs.push(fadeOutput);

  // ----- Extra Outputs -----
  let extraOutputs = [];
  // If reflex mode is active, output the reflex colour band
  if (document.body.classList.contains("reflex-on")) {
    let reflexSlider = document.getElementById("reflex-color-slider");
    if (reflexSlider) {
      let reflexVal = parseInt(reflexSlider.value, 10);
      let reflexBand = "";
      if (reflexVal < 15) {
        reflexBand = "light blue";
      } else if (reflexVal < 45) {
        reflexBand = "yellow";
      } else if (reflexVal < 80) {
        reflexBand = "orange";
      } else {
        reflexBand = "red";
      }
      extraOutputs.push("reflex (" + reflexBand + ")");
    }
  } else {
    // Otherwise, show the chosen iris colour
    let irisColourSelect = document.getElementById("iris-colour");
    if (irisColourSelect) {
      let irisVal = irisColourSelect.value;
      let irisDisplay = irisVal === "dark-brown" ? "dark" :
                        (irisVal === "light-brown" ? "brown" : irisVal);
      extraOutputs.push("iris (" + irisDisplay + ")");
    }
  }
  // If the sudden toggle is active, include it in the output
  if (document.getElementById("toggle-sudden").checked) {
    extraOutputs.push("SUDDEN");
  }

  outputs = outputs.concat(extraOutputs);
  let finalOutput = outputs.length > 0 ? outputs.join(" | ") : "normal";

  // Update the correct output element based on the eye type
  if (eyeType === "left" || eyeID === "left-eye") {
    document.getElementById("right-output").innerHTML = "RE: " + finalOutput;
  } else if (eyeType === "right" || eyeID === "right-eye") {
    document.getElementById("left-output").innerHTML = "LE: " + finalOutput;
  }
}

// -----------------------------
// Draggable Iris Functionality
// -----------------------------
/**
 * Enable dragging for the iris element.
 * Constrains movement within a defined range and updates the output on drag end.
 */
function initDraggable(draggable) {
  let dragging = false;
  const eye = draggable.closest('.eye');
  let eyeRect, centreX, centreY, maxOffsetX, maxOffsetY;
  draggable.isDragging = false;

  // Begin dragging; compute initial parameters.
  function startDrag(e) {
    e.preventDefault();
    dragging = true;
    draggable.isDragging = true;
    eyeRect = eye.getBoundingClientRect();
    centreX = eyeRect.left + eyeRect.width / 2;
    centreY = eyeRect.top + eyeRect.height / 2;
    maxOffsetX = (((eyeRect.width / 2) - (draggable.offsetWidth / 2)) * 0.8);
    maxOffsetY = 30 * 0.8;

    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
    } else {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', endDrag);
    }
  }

  // Process the dragging movement.
  function onDrag(e) {
    if (!dragging) return;
    let pointerX, pointerY;
    if (e.type === 'touchmove') {
      pointerX = e.touches[0].clientX;
      pointerY = e.touches[0].clientY;
    } else {
      pointerX = e.clientX;
      pointerY = e.clientY;
    }
    let dx = pointerX - centreX;
    let dy = pointerY - centreY;

    // Constrain the movement horizontally and vertically.
    if (Math.abs(dx) > maxOffsetX) {
      dx = Math.sign(dx) * maxOffsetX;
    }
    if (Math.abs(dy) > maxOffsetY) {
      dy = Math.sign(dy) * maxOffsetY;
    }

    // Update the iris position.
    draggable.style.left = `calc(50% + ${dx}px - ${draggable.offsetWidth / 2}px)`;
    draggable.style.top = `calc(50% + ${dy}px - ${draggable.offsetHeight / 2}px)`;

    // In reflex mode, adjust pupil brightness based on displacement.
    if (document.body.classList.contains('reflex-on')) {
      const pupil = draggable.querySelector('.pupil');
      if (pupil) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.sqrt(maxOffsetX * maxOffsetX + maxOffsetY * maxOffsetY);
        let factor = 1 + Math.min(distance / maxDistance, 1);
        const brightColor = brightenColor(baseReflexColor, factor);
        pupil.style.background = `rgb(${brightColor.r}, ${brightColor.g}, ${brightColor.b})`;
      }
    }
  }

  // End dragging; remove listeners and update output.
  function endDrag(e) {
    dragging = false;
    draggable.isDragging = false;

    if (e.type === 'touchend') {
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('touchend', endDrag);
    } else {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', endDrag);
    }

    // Calculate final displacement.
    const draggableRect = draggable.getBoundingClientRect();
    const draggableCentreX = draggableRect.left + draggableRect.width / 2;
    const draggableCentreY = draggableRect.top + draggableRect.height / 2;
    const eyeCentreX = eyeRect.left + eyeRect.width / 2;
    const eyeCentreY = eyeRect.top + eyeRect.height / 2;
    const dx = draggableCentreX - eyeCentreX;
    const dy = draggableCentreY - eyeCentreY;

    // Update the displayed output.
    updateEyeOutput(eye, dx, dy);
  }

  draggable.addEventListener('mousedown', startDrag);
  draggable.addEventListener('touchstart', startDrag, { passive: false });
}

// -----------------------------
// Slider Functionality
// -----------------------------
/**
 * Pupil Size Slider: Adjust the pupil size and recentre it.
 * Defaults to 32px. Also includes snap-to-centre logic.
 */
function initSlider(slider) {
  function updatePupil() {
    const eyeData = slider.getAttribute("data-eye");
    const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
    if (eye) {
      const pupil = eye.querySelector(".pupil");
      const newSize = parseInt(slider.value, 10);
      pupil.style.width = newSize + "px";
      pupil.style.height = newSize + "px";
      pupil.style.left = `calc(50% - ${newSize / 2}px)`;
      pupil.style.top = `calc(50% - ${newSize / 2}px)`;
      // Update the output immediately
      updateOutputForEye(eye);
    }
  }

  slider.addEventListener("input", updatePupil);

  // Snap to the default centre value if within a small tolerance.
  function snapToCentre() {
    const centre = 32;
    const tolerance = 3;
    const current = parseInt(slider.value, 10);
    if (Math.abs(current - centre) <= tolerance) {
      slider.value = centre;
      updatePupil();
    }
  }

  slider.addEventListener("change", snapToCentre);
  slider.addEventListener("mouseup", snapToCentre);
  slider.addEventListener("touchend", snapToCentre);

  // Initialise the pupil size when the page loads.
  updatePupil();
}

/**
 * Upper Eyelid Ptosis Slider: Adjust the upper eyelid height based on slider input.
 * This function updates the lid and output accordingly.
 */
function initVerticalEyelidSlider() {
  const eyelidSliders = document.querySelectorAll(".vertical-eye-slider");
  eyelidSliders.forEach(slider => {
    slider.addEventListener("input", function() {
      const eyeData = slider.getAttribute("data-eye");
      const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
      if (eye) {
        const upperEyelid = eye.querySelector(".upper-eyelid");
        if (upperEyelid) {
          // Multiply the slider value to get a suitable height in pixels.
          upperEyelid.style.height = (slider.value * 1.5) + "px";
        }
        // Update the output for this eye.
        updateOutputForEye(eye);
      }
    });
  });
}

/**
 * Fade Button: Toggle the faded iris overlay.
 * Also updates the output to reflect the faded state.
 */
function initFadeButton(button) {
  button.addEventListener("click", function() {
    const eyeData = button.getAttribute("data-eye");
    const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
    if (eye) {
      const iris = eye.querySelector(".iris");
      if (iris) {
        iris.classList.toggle("faded");
        button.classList.toggle("active");
      }
      updateOutputForEye(eye);
    }
  });
}

// -----------------------------
// Iris Colour and Reflex Mode
// -----------------------------
/**
 * Update the iris colour when not in reflex mode.
 * Reads the chosen colour from a select element and applies it to all irises.
 */
function updateIrisColour() {
  if (document.body.classList.contains('reflex-on')) return;
  const irisColour = document.getElementById('iris-colour').value;
  let colour;
  const rootStyles = getComputedStyle(document.documentElement);
  switch (irisColour) {
    case 'dark-brown':
      colour = rootStyles.getPropertyValue('--iris-dark-brown').trim();
      break;
    case 'light-brown':
      colour = rootStyles.getPropertyValue('--iris-light-brown').trim();
      break;
    case 'green':
      colour = rootStyles.getPropertyValue('--iris-green').trim();
      break;
    case 'blue':
      colour = rootStyles.getPropertyValue('--iris-blue').trim();
      break;
    default:
      colour = rootStyles.getPropertyValue('--iris-green').trim();
  }
  document.querySelectorAll('.iris').forEach(function(iris) {
    iris.style.background = colour;
  });
}

/**
 * Get the interpolated reflex colour based on a slider value.
 * Interpolates between defined colour stops.
 */
function getReflexColor(val) {
  const colorStops = [
    { value: 0, color: { r: Math.round(173 * 0.7), g: Math.round(216 * 0.7), b: Math.round(230 * 0.7) } },
    { value: 33, color: { r: Math.round(255 * 0.7), g: Math.round(220 * 0.7), b: Math.round(0 * 0.7) } },
    { value: 66, color: { r: Math.round(218 * 0.7), g: Math.round(58 * 0.7), b: Math.round(0 * 0.7) } },
    { value: 100, color: { r: Math.round(255 * 0.7), g: Math.round(0 * 0.7), b: Math.round(0 * 0.7) } }
  ];

  let lowerStop, upperStop;
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (val >= colorStops[i].value && val <= colorStops[i+1].value) {
      lowerStop = colorStops[i];
      upperStop = colorStops[i+1];
      break;
    }
  }
  if (!lowerStop || !upperStop) {
    return "rgb(255, 0, 0)";
  }
  let factor = (val - lowerStop.value) / (upperStop.value - lowerStop.value);
  let r = Math.round(lowerStop.color.r + (upperStop.color.r - lowerStop.color.r) * factor);
  let g = Math.round(lowerStop.color.g + (upperStop.color.g - lowerStop.color.g) * factor);
  let b = Math.round(lowerStop.color.b + (upperStop.color.b - lowerStop.color.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

// Reflex colour slider event listener
document.getElementById('reflex-color-slider').addEventListener('input', function() {
  const val = parseInt(this.value, 10);
  const newColor = getReflexColor(val);
  this.style.backgroundColor = newColor;

  // Update the iris (pupil) colour if reflex mode is active.
  if (document.body.classList.contains('reflex-on')) {
    document.querySelectorAll('.iris').forEach(iris => {
      const pupil = iris.querySelector('.pupil');
      if (pupil) {
        pupil.style.background = newColor;
      }
    });
  }

  // Update the global base reflex colour (without dulling).
  let parsed = parseRGB(newColor);
  baseReflexColor = { r: parsed.r, g: parsed.g, b: parsed.b };

  // Update output for all eyes.
  document.querySelectorAll('.eye').forEach(eye => {
    updateOutputForEye(eye);
  });
});

// -----------------------------
// Micro Saccades and Background Jitter
// -----------------------------
/**
 * Start micro saccades, simulating small rapid eye movements.
 * The iris temporarily shifts then returns to its position.
 */
// Modified updateIrisTransform: if conditionApplied is true, don't override.
function updateIrisTransform(iris) {
  if (iris.conditionApplied) {
    return;
  }
  const totalX = (iris.microOffset?.x || 0) + (iris.backgroundOffset?.x || 0);
  const totalY = (iris.microOffset?.y || 0) + (iris.backgroundOffset?.y || 0);
  iris.style.transform = `translate(${totalX}px, ${totalY}px)`;
}

// Modified startMicroSaccades: skip updates if a condition is applied.
function startMicroSaccades() {
  const saccadeInterval = 3000;
  const saccadeDuration = 100;
  document.querySelectorAll('.iris').forEach(iris => {
    iris.microOffset = { x: 0, y: 0 };
  });
  setInterval(() => {
    const offsetX = parseFloat((Math.random() * 3 - 1).toFixed(2));
    const offsetY = parseFloat((Math.random() * 3 - 1).toFixed(2));
    document.querySelectorAll('.iris').forEach(iris => {
      if (!iris.isDragging && !iris.conditionApplied) {
        iris.microOffset = { x: offsetX, y: offsetY };
        updateIrisTransform(iris);
      }
    });
    setTimeout(() => {
      document.querySelectorAll('.iris').forEach(iris => {
        if (!iris.isDragging && !iris.conditionApplied) {
          iris.microOffset = { x: 0, y: 0 };
          updateIrisTransform(iris);
        }
      });
    }, saccadeDuration);
  }, saccadeInterval);
}

// Modified startBackgroundJitter: skip updates if conditionApplied is true.
function startBackgroundJitter() {
  const jitterInterval = 200;
  document.querySelectorAll('.iris').forEach(iris => {
    iris.backgroundOffset = { x: 0, y: 0 };
  });
  setInterval(() => {
    document.querySelectorAll('.iris').forEach(iris => {
      if (!iris.isDragging && !iris.conditionApplied) {
        const jitterX = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));
        const jitterY = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));
        iris.backgroundOffset = { x: jitterX, y: jitterY };
        updateIrisTransform(iris);
      }
    });
  }, jitterInterval);
}


// -----------------------------
// Blink and Eyelid Simulation
// -----------------------------
/**
 * Simulate a blink by temporarily closing the eye.
 * Saves the current eyelid state, then restores it after a short duration.
 */
function blinkEyes() {
  document.querySelectorAll('.eye').forEach(eye => {
    const upperEyelid = eye.querySelector('.upper-eyelid');
    const lowerEyelid = eye.querySelector('.lower-eyelid');
    const currentUpper = upperEyelid ? upperEyelid.style.height || "0px" : "0px";
    const currentLower = lowerEyelid ? lowerEyelid.style.height || "0px" : "0px";
    if (upperEyelid) {
      // Set the upper eyelid to 70% of a standard 75px height.
      upperEyelid.style.height = "52.5px";
    }
    if (lowerEyelid) {
      // Set the lower eyelid to 30% of 75px.
      lowerEyelid.style.height = "22.5px";
    }
    setTimeout(() => {
      if (upperEyelid) {
        upperEyelid.style.height = currentUpper;
      }
      if (lowerEyelid) {
        lowerEyelid.style.height = currentLower;
      }
    }, 100);
  });
}

// -----------------------------
// DOMContentLoaded Initialization
// -----------------------------
/**
 * Initialise event listeners and start the eye operations when the document loads.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialise draggable irises.
  document.querySelectorAll('.iris').forEach(initDraggable);
  // Initialise pupil size sliders.
  document.querySelectorAll('.slider').forEach(initSlider);
  // Initialise fade buttons.
  document.querySelectorAll('.fade-button').forEach(initFadeButton);

  // Toggle reflex mode and update iris colours.
  document.getElementById('toggle-reflex').addEventListener('change', function() {
    document.body.classList.toggle('reflex-on', this.checked);
    if (this.checked) {
      document.querySelectorAll('.iris').forEach(function(iris) {
        iris.style.background = 'black';
      });
    } else {
      updateIrisColour();
    }
    // Update output for all eyes.
    document.querySelectorAll('.eye').forEach(eye => updateOutputForEye(eye));
  });

  // When the iris colour selection changes, update the display.
  document.getElementById('iris-colour').addEventListener('change', function() {
    updateIrisColour();
    document.querySelectorAll('.eye').forEach(eye => updateOutputForEye(eye));
  });

  // Sudden toggle: change label colour to red when active.
  document.getElementById('toggle-sudden').addEventListener('change', function() {
    const suddenLabel = document.querySelector('.toggle-sudden .toggle-label');
    if (this.checked) {
      suddenLabel.style.color = 'red';
    } else {
      suddenLabel.style.color = '';
    }
    // Update output for all eyes.
    document.querySelectorAll('.eye').forEach(eye => updateOutputForEye(eye));
  });

  // Fun startup: make both eyes quickly jump to a random position.
  const randomX = Math.random() * 60 - 30; // offset between -30 and 30 px
  const randomY = Math.random() * 60 - 30;
  const irises = document.querySelectorAll('.iris');

  // Apply a brief transition for the jump.
  irises.forEach(iris => {
    iris.style.transition = 'transform 0.2s ease-out';
    iris.style.transform = `translate(${randomX}px, ${randomY}px)`;
  });

  // Return irises to centre, then clear transition and start normal operations.
  setTimeout(() => {
    irises.forEach(iris => {
      iris.style.transform = 'translate(0, 0)';
    });
    setTimeout(() => {
      irises.forEach(iris => {
        iris.style.transition = '';
      });
      startMicroSaccades();
      startBackgroundJitter();
      initVerticalEyelidSlider();
      setInterval(blinkEyes, 5000);
    }, 250);
  }, 250);
});

document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.getElementById('sidebar');
  var toggleBtn = document.getElementById('sidebar-toggle');
  var closeBtn = document.getElementById('close-sidebar');

  // Toggle sidebar on button click
  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });

  // Close sidebar on close button click
  closeBtn.addEventListener('click', function() {
    sidebar.classList.remove('open');
  });

  // Swipe functionality for mobile devices
  let touchStartX = null;
  let touchStartY = null;

  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, false);

  document.addEventListener('touchend', function(e) {
    if (touchStartX === null || touchStartY === null) return;
    
    var touchEndX = e.changedTouches[0].screenX;
    var touchEndY = e.changedTouches[0].screenY;
    var diffX = touchEndX - touchStartX;
    var diffY = touchEndY - touchStartY;
    
    // Check horizontal swipe only
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 50) {
        // Swipe right opens the sidebar
        sidebar.classList.add('open');
      } else if (diffX < -50) {
        // Swipe left closes the sidebar
        sidebar.classList.remove('open');
      }
    }
    
    // Reset values
    touchStartX = null;
    touchStartY = null;
  }, false);



  // "Text me" button event
  var textMeBtn = document.getElementById('textMeBtn');
  textMeBtn.addEventListener('click', function() {
    // Get all condition list items.
    var liElements = document.querySelectorAll('.conditions-list li');
    // Choose a random list item.
    var randomIndex = Math.floor(Math.random() * liElements.length);
    var randomConditionLi = liElements[randomIndex];
  
    // Remove any previous highlights.
    liElements.forEach(function(li) {
      li.style.backgroundColor = '';
    });
  
    // Determine the condition text.
    var conditionText = randomConditionLi.textContent.trim().toLowerCase();
  
    // If the list item contains radio buttons, pick one at random.
    var radioInputs = randomConditionLi.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
      var randomRadioIndex = Math.floor(Math.random() * radioInputs.length);
      var selectedRadio = radioInputs[randomRadioIndex];
      selectedRadio.checked = true;
      selectedRadio.dispatchEvent(new Event('change'));
      // Create a condition string from the radio group.
      conditionText = selectedRadio.name + " (" + selectedRadio.value + ")";
    }
  
    // Apply the condition.
    applyCondition(conditionText);
  
    // Close the sidebar immediately.
    document.getElementById('sidebar').classList.remove('open');
  
    // After a 500ms delay, highlight the chosen condition in red.
    setTimeout(function() {
      randomConditionLi.style.backgroundColor = 'red';
    }, 500);
  });
  
  




function applyCondition(condition) {
  // Reset both eyes to a known state.
  document.getElementById('toggle-sudden').checked = false;
  
  var leftEye = document.querySelector('.eye[data-eye="left"]');
  var rightEye = document.querySelector('.eye[data-eye="right"]');

  // Reset neutral state and clear any condition flags.
  [leftEye, rightEye].forEach(eye => {
    if (eye) {
      var iris = eye.querySelector('.iris');
      iris.style.transform = 'translate(0,0)';
      iris.classList.remove('faded');
      iris.conditionApplied = false; // Clear any previously applied condition.
      
      var ptosisSlider = document.querySelector(`.vertical-eye-slider[data-eye="${eye.getAttribute('data-eye')}"]`);
      if (ptosisSlider) {
        ptosisSlider.value = 0;
        ptosisSlider.dispatchEvent(new Event('input'));
      }
      
      var pupilSlider = document.querySelector(`.slider[data-eye="${eye.getAttribute('data-eye')}"]`);
      if (pupilSlider) {
        pupilSlider.value = 32;
        pupilSlider.dispatchEvent(new Event('input'));
      }
    }
  });
  
  // Apply condition-specific changes.
  switch(condition) {
    // Nerve palsies.
    case '3rd nerve palsy':
      document.getElementById('toggle-sudden').checked = true;
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(30px,30px)';
        rIris.conditionApplied = true;
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 20;
          rPtosis.dispatchEvent(new Event('input'));
        }
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        if (rPupil) {
          rPupil.value = 45;
          rPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case '4th nerve palsy':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(30px,-20px)';
        rIris.conditionApplied = true;
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 10;
          rPtosis.dispatchEvent(new Event('input'));
        }
      }
      break;
    case '6th nerve palsy':
      document.getElementById('toggle-sudden').checked = true;
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(-30px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case "horner’s syndrome":
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.classList.add('faded');
        rIris.conditionApplied = true;
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 20;
          rPtosis.dispatchEvent(new Event('input'));
        }
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        if (rPupil) {
          rPupil.value = 25;
          rPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'mixed squint':
      if (leftEye) {
        var lIris = leftEye.querySelector('.iris');
        lIris.style.transform = 'translate(10px,5px)';
        lIris.conditionApplied = true;
      }
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(-10px,-5px)';
        rIris.conditionApplied = true;
      }
      break;

    // Horizontal deviations.
    case 'exotropia (small)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(10px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'exotropia (medium)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(20px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'exotropia (large)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(30px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'esotropia (small)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(-10px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'esotropia (medium)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(-20px,0px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'esotropia (large)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(-30px,0px)';
        rIris.conditionApplied = true;
      }
      break;
      
    // Vertical deviations.
    case 'hypertropia (small)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,-10px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'hypertropia (medium)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,-20px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'hypertropia (large)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,-30px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'hypotropia (small)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,10px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'hypotropia (medium)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,20px)';
        rIris.conditionApplied = true;
      }
      break;
    case 'hypotropia (large)':
      if (rightEye) {
        var rIris = rightEye.querySelector('.iris');
        rIris.style.transform = 'translate(0px,30px)';
        rIris.conditionApplied = true;
      }
      break;
      
    // Ptosis.
    case 'slight ptosis':
      if (rightEye) {
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 5;
          rPtosis.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'moderate ptosis':
      if (rightEye) {
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 15;
          rPtosis.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'severe ptosis':
      if (rightEye) {
        var rPtosis = document.querySelector('.vertical-eye-slider[data-eye="right"]');
        if (rPtosis) {
          rPtosis.value = 25;
          rPtosis.dispatchEvent(new Event('input'));
        }
      }
      break;
      
    // Pupil conditions.
    case 'benign anisocoria':
      if (rightEye && leftEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        var lPupil = document.querySelector('.slider[data-eye="left"]');
        if (rPupil && lPupil) {
          rPupil.value = 34;
          rPupil.dispatchEvent(new Event('input'));
          lPupil.value = 32;
          lPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'adie’s pupil':
      if (rightEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        if (rPupil) {
          rPupil.value = 45;
          rPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'unilateral dilated pupil':
      if (rightEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        if (rPupil) {
          rPupil.value = 50;
          rPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'bilateral dilated pupils':
      if (rightEye && leftEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        var lPupil = document.querySelector('.slider[data-eye="left"]');
        if (rPupil && lPupil) {
          rPupil.value = 50;
          rPupil.dispatchEvent(new Event('input'));
          lPupil.value = 50;
          lPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'unilateral constricted pupil':
      if (rightEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        if (rPupil) {
          rPupil.value = 25;
          rPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
    case 'bilateral constricted pupils':
      if (rightEye && leftEye) {
        var rPupil = document.querySelector('.slider[data-eye="right"]');
        var lPupil = document.querySelector('.slider[data-eye="left"]');
        if (rPupil && lPupil) {
          rPupil.value = 25;
          rPupil.dispatchEvent(new Event('input'));
          lPupil.value = 25;
          lPupil.dispatchEvent(new Event('input'));
        }
      }
      break;
      
    default:
      // For any other condition, leave neutral.
      break;
  }
  
  // Update the output so the analysis reflects the changes.
  if (leftEye) updateOutputForEye(leftEye);
  if (rightEye) updateOutputForEye(rightEye);
}

// Event listeners for list items that do not contain radio buttons.
document.querySelectorAll('.conditions-list li:not(:has(input))').forEach(function(item) {
  item.addEventListener('click', function() {
    var condition = item.textContent.trim().toLowerCase();
    applyCondition(condition);
  });
});

// Event listeners for radio inputs inside list items.
document.querySelectorAll('.conditions-list input[type="radio"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var groupName = radio.name; // e.g. "exotropia"
    var size = radio.value;      // e.g. "small"
    var condition = groupName + " (" + size + ")";
    applyCondition(condition);
  });
});
});

async function downloadSelectedAssets() {
  const selected = Array.from(document.querySelectorAll('#offlineContentModal input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  const assetMap = {
    cataract: [
      './cataractPage.html',
      './videos/Cataract.mp4',
      './images/icons_pic/Cataract.png'
    ],
    visualAcuity: [
      './visualAcuityPage.html',
      './videos/VisualAcuity.mp4',
      './images/icons_pic/VisualAcuity.png'
    ],
    directOphthalmoscopy: [
      './directOphthalmoscopy.html',
      './videos/DirectOphthalmoscopy.mp4',
      './images/icons_pic/DirectOphthalmoscopy.png'
    ],
    frontOfEye: [
      './frontOfEyePage.html',
      './videos/AnteriorSegment.mp4',
      './AnteriorSegmentQuiz/html/index.html',
      './AnteriorSegmentQuiz/html/images/case1_eye.png',
      './AnteriorSegmentQuiz/html/images/case2_eye.png',
      './AnteriorSegmentQuiz/html/images/case3_eye.png',
      './AnteriorSegmentQuiz/html/images/case4_eye.png'
    ],
    interactiveLearning: [
      './interactiveLearningPage.html',
      './images/icons_pic/Interactive.png'
    ],
    atomsCard: [
      './atomsCardPage.html',
      './images/Anatomy1.png',
      './images/Anatomy2.png',
      './images/Fundus.png',
      './images/Glaucoma.png',
      './images/Refract.png'
    ]
  };

  const assetsToCache = selected.flatMap(key => assetMap[key] || []);
  const sw = await navigator.serviceWorker.ready;
  sw.active.postMessage({ type: 'CACHE_ASSETS', payload: assetsToCache });

  alert('Download started in background');
  document.getElementById('offlineContentModal').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function() {
  // When the user clicks 'test me'
  var textMeBtn = document.getElementById('textMeBtn');
  var analysisContainer = document.getElementById('analysisContainer');
  var analysisPlaceholder = document.getElementById('analysisPlaceholder');
  var showAnswerBtn = document.getElementById('showAnswerBtn');

  textMeBtn.addEventListener('click', function() {
    // Hide analysisContainer and show the placeholder
    analysisContainer.style.display = 'none';
    analysisPlaceholder.style.display = 'block';
  });

  showAnswerBtn.addEventListener('click', function() {
    // Show analysisContainer again and hide the placeholder
    analysisContainer.style.display = 'block';
    analysisPlaceholder.style.display = 'none';
  });
});

