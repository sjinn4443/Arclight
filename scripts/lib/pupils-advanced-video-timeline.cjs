// Keep the scroll narration clock intact while omitting silent video tails.
module.exports = function videoTimeline(config, titleSeconds = 3) {
  let clock = 0;
  return config.narrationClipsByFile.map((clip, index) => {
    const title = config.sections.find((s) => s.startIndex === index);
    const titleStart = clock;
    if (title) clock += titleSeconds;
    const sourceStart = index === 0 ? 0 : clip.start;
    const sourceEnd = [0, 13].includes(index)
      ? Math.round(Math.max(...Object.values(clip.endByLanguage)) * 30) / 30
      : clip.end;
    const scene = {
      index,
      sourceStart,
      sourceEnd,
      start: clock,
      end: clock + sourceEnd - sourceStart,
      ...(title ? { title: title.title, titleStart, titleEnd: clock } : {}),
    };
    clock = scene.end;
    return scene;
  });
};
