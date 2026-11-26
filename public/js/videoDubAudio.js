// Keep the video clock and controls while replacing its original soundtrack.
export function createVideoDubAudio(video, audio) {
  let active = false;
  let muted = false;
  let sourceMuted = false;

  function updateVolume() {
    if (active && !video.muted) {
      // A native or in-app unmute action controls the replacement soundtrack.
      muted = !muted;
      sourceMuted = muted;
      video.muted = true;
    }
    audio.volume = video.volume;
    audio.muted = active ? muted : video.muted;
  }

  video.addEventListener("volumechange", updateVolume);

  return {
    enable(enabled, { unmute = false } = {}) {
      if (active === enabled) return;
      active = enabled;
      if (enabled) {
        sourceMuted = video.muted;
        muted = !unmute && sourceMuted;
        video.muted = true;
      } else {
        video.muted = sourceMuted;
      }
      updateVolume();
    },
    updateVolume,
  };
}
