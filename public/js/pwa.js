/**
 * @fileoverview This file contains pwa related functions and logic. Including service worker registration and handling the 'beforeinstallprompt' event for app installation.
 */

let deferredPrompt = null;
let initialized = false;
function showOfflineFailure() {
  let notice = document.getElementById("pwa-install-error");
  if (!notice) {
    notice = document.createElement("p");
    notice.id = "pwa-install-error";
    notice.setAttribute("role", "alert");
    // Keep the alert in document flow so it cannot cover lesson controls.
    document.body.prepend(notice);
  }
  const message = "Offline setup failed. Reconnect and reload to try again.";
  notice.textContent =
    window.I18N?.translateLiteral?.(message, message) || message;
}

export function initializePWA() {
  if (initialized) return;
  initialized = true;
  // 1) Capture beforeinstallprompt so we can trigger later
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // document.getElementById('installPopup')?.style && (document.getElementById('installPopup').style.display = 'block');
    console.warn("[pwa] beforeinstallprompt captured");
  });

  // 2) Register Service Worker (required for install prompt on Chrome)
  if (
    "serviceWorker" in navigator &&
    (location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1")
  ) {
    navigator.serviceWorker
      .register("sw.js")
      .then(async (reg) => {
        console.warn("[pwa] SW registered", reg.scope);
        const watch = (worker) => {
          if (!worker) return;
          let activated = worker.state === "activated";
          worker.addEventListener("statechange", () => {
            if (worker.state === "activated") activated = true;
            if (worker.state === "redundant" && !activated)
              showOfflineFailure();
          });
        };
        watch(reg.installing);
        reg.addEventListener("updatefound", () => watch(reg.installing));

        // 1) 페이지 로드 시점에 즉시 업데이트 체크
        try {
          await reg.update();
        } catch (e) {
          console.warn("[pwa] SW update() failed", e);
        }

        // 2) 새 서비스워커가 설치돼서 waiting 상태면 즉시 활성화 요청
        if (reg.waiting) {
          const channel = new MessageChannel();
          reg.waiting.postMessage({ type: "SKIP_WAITING" }, [channel.port2]);
        }

        // 3) 새 SW가 컨트롤러가 되는 순간 자동 새로고침 (최신 파일로 교체)
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });

        // 4) 업데이트 발견 시에도 waiting이면 즉시 활성화 요청
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;

          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && reg.waiting) {
              const channel = new MessageChannel();
              reg.waiting.postMessage({ type: "SKIP_WAITING" }, [
                channel.port2,
              ]);
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[pwa] SW register failed", err);
        showOfflineFailure();
      });
  }
}

// Query if prompt is available
export function canInstall() {
  return !!deferredPrompt;
}

// Trigger the native install prompt; resolves when user accepts/dismisses
export async function promptInstall() {
  if (!deferredPrompt) {
    // On some platforms, prompt may not be available (already installed, not eligible, etc.)
    throw new Error("Install prompt not available");
  }
  deferredPrompt.prompt();
  try {
    const { outcome } = await deferredPrompt.userChoice; // 'accepted' | 'dismissed'
    console.warn("[pwa] userChoice:", outcome);
    return outcome;
  } finally {
    deferredPrompt = null; // can only be used once
  }
}
