const titles = require("./full-animation-title-captions.json");

// Caption-only cards use the video clock, including while narration runs ahead.
// Kept separate from speech cues so regenerating audio never reads a title aloud.
function applyVideoTitleCaptions(script, lesson) {
  const cues = titles[lesson];
  if (!cues) throw new Error(`No title captions for ${lesson}`);
  script.videoTitleCues = cues;
}

module.exports = { applyVideoTitleCaptions };
