export function initializeVisualImpairment() {
  const page = document.getElementById("visualImpairmentPage");
  if (!page) return;

  console.log("Visual Impairment page initialized");

  // 비디오가 화면에서 벗어나면 일시정지하는 최적화 로직
  const videos = page.querySelectorAll("video");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) entry.target.pause();
      });
    },
    { threshold: 0.1 },
  );

  videos.forEach((video) => observer.observe(video));
}
