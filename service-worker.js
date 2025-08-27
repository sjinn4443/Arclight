/* 2025-06-25, SJ */
/* service-worker.js
 * Arclight PWA – offline‑first, version 4
 * ---------------------------------------
 * – **Pre‑caches _every_ local HTML, CSS, JS, image and video file** so the
 *   whole app runs 100 % offline after the very first visit.
 * – Network‑first strategy for page navigations (so content can update),
 *   cache‑first for everything else (so images/videos appear instantly).
 * – Cleans up old caches when a new version is deployed.
 * – Skips the waiting phase and takes control immediately.
 *
 * **Heads‑up:** Because all videos are precached, the initial install size is
 * large (≈ 200 MB). Consider showing users a "Downloading assets…" spinner on
 * first load.
 */

const CACHE_NAME = 'arclight-static-v6';

// List of files to precache.
// Keep them **relative** so the PWA can be hosted from *any* folder or origin.
// ---------------------------------------------------------------------------
const ASSETS = [
  /* Core shell */
  './',
  './index.html',
  './script.js',
  './style.css',
  './responsive.css',
  './manifest.json',

  /* Images – ZambiaTestApp core */
  './images/logo.png',
  './images/arclight_device.png',
  './images/Summary.png',
  './images/case1_eye.png',
  './images/Anatomy1.png',
  './images/Anatomy2.png',
  './images/CaseStudy.png',
  './images/CaseStudy2.png',
  './images/FrontOfEye.png',
  './images/FundalReflex.png',
  './images/Fundus.png',
  './images/Glaucoma.png',
  './images/Refract.png',
  './images/HowToUse.png',
  /* Icons */
  './images/HomeIcon.png',
  './images/icons_pic/FrontOfEye.png',
  './images/icons_pic/CaseStudy.png',
  './images/icons_pic/Pupils.png',
  './images/icons_pic/FundalReflex.png',
  './images/icons_pic/DirectOphthalmoscopy.png',
  './images/icons_pic/HistoryTaking.png',
  './images/icons_pic/VisualAcuity.png',

  /* Ear images */
  './images/Ears/OtoscopyENT.jpg',
  './images/Ears/TeachingPoster.jpg',
  './images/Ears/HealthandDeafness.jpg',

  /* Videos – Eyes */
  './videos/DirectOphthalmoscopy.mp4',
  './videos/AnteriorSegment.mp4',
  './videos/Pupil/RAPDTest.mp4',
  './videos/Pupil/PupilExam.mp4',
  './videos/Pupil/PupilExamPEC.mp4',
  './videos/Pupil/PupilPathways.mp4',

  /* Videos – Childhood eye‑screening (USAID) */
  './videos/USAID/HowtoArclight.mp4',
  './videos/USAID/AssessmentVision.mp4',
  './videos/USAID/NormalAbnormal.mp4',

  /* Videos – Ears */
  './videos/Otoscopy/Instructional.mp4',

  /* -------------------------------------------------------------------- */
  /* === Anterior Segment Quiz assets (used by Front‑of‑Eye Quiz) ======== */
  /* Add every image / video that lives in the Anterior Segment Quiz folder*/
  './AnteriorSegmentQuiz/html/index.html',
  // ----- IMAGES ---------------------------------------------------------
  './AnteriorSegmentQuiz/html/images/case1_eye.png',
  './AnteriorSegmentQuiz/html/images/case2_eye.png',
  './AnteriorSegmentQuiz/html/images/case3_eye.png',
  './AnteriorSegmentQuiz/html/images/case4_eye.png',
  './AnteriorSegmentQuiz/html/images/case5_eye.png',
  './AnteriorSegmentQuiz/html/images/case6_eye.png',
  './AnteriorSegmentQuiz/html/images/case7_eye.png',
  './AnteriorSegmentQuiz/html/images/case8_eye.png',
  './AnteriorSegmentQuiz/html/images/case9_eye.png',
  './AnteriorSegmentQuiz/html/images/case10_eye.png',
  './AnteriorSegmentQuiz/html/images/case11_eye.png',
  './AnteriorSegmentQuiz/html/images/case12_eye.png',

// ---------------------------------------------------------------------------

];

// INSTALL – precache everything listed above
self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        ASSETS.map(url =>
          fetch(url)
            .then(response => {
              if (response.ok) {
                return cache.put(url, response);
              } else {
                console.warn(`Skipping ${url}: HTTP ${response.status}`);
              }
            })
            .catch(err => {
              console.warn(`Skipping ${url}: Fetch failed`, err);
            })
        )
      )
    )
  );
});

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CACHE_ASSETS') {
    const urls = event.data.payload;
    const cache = await caches.open(CACHE_NAME);

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone());
          console.log(`✅ Cached: ${url}`);
        }
      } catch (err) {
        console.warn(`❌ Failed to cache: ${url}`, err);
      }
    }
  }
});



// ACTIVATE – purge old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH – network‑first for navigations, cache‑first for all other requests
self.addEventListener('fetch', event => {
  const { request } = event;

  // Navigations (HTML pages)
 if (request.mode === 'navigate') {
  event.respondWith(
    fetch(request)
      .then(response => {
        // clone **once**, then stash a copy in the cache
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;               // send original response to the page
      })
      .catch(() => caches.match('./index.html')) // offline fallback
  );
  return; // bail – we handled this request
}

  // Static assets – cache‑first
  // FETCH – cache-first for static assets
event.respondWith(
  caches.match(request).then(cached => {
    // ➊  Serve from cache if we already have it
    if (cached) return cached;

    // ➋  Otherwise fetch from network
    return fetch(request).then(networkResp => {
      // clone ONCE, then save the copy
      const copy = networkResp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));

      // ➌  Return the original response to the page
      return networkResp;
    });
  })
);

});

