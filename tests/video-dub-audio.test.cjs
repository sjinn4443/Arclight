/** @jest-environment jsdom */

describe("video dub audio", () => {
  let createVideoDubAudio;

  beforeAll(async () => {
    ({ createVideoDubAudio } = await import("../public/js/videoDubAudio.js"));
  });

  it("replaces the original soundtrack while keeping the viewer's mute and volume controls", () => {
    const video = document.createElement("video");
    const audio = document.createElement("audio");
    const output = createVideoDubAudio(video, audio);
    output.enable(true);
    expect(video.muted).toBe(true);
    expect(audio.muted).toBe(false);

    video.volume = 0.4;
    video.dispatchEvent(new Event("volumechange"));
    expect(audio.volume).toBe(0.4);

    video.muted = false;
    video.dispatchEvent(new Event("volumechange"));
    expect(video.muted).toBe(true);
    expect(audio.muted).toBe(true);

    output.enable(false);
    expect(video.muted).toBe(true);
  });

  it("restores the original source audio when an audible dub is disabled", () => {
    const video = document.createElement("video");
    const audio = document.createElement("audio");
    const output = createVideoDubAudio(video, audio);
    output.enable(true);
    output.enable(false);
    expect(video.muted).toBe(false);
  });
});
