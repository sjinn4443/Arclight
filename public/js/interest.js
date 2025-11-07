/**
 * @fileoverview This file  ,anages the professional interest selection page, handling chip selection and initiating the splash screen animation before navigating to the introduction page.
 */

import { loadPage } from "./navigation.js";
import { saveProfile } from "./telemetry.js";

/**
 * Initializes the professional interest page.
 * Sets up click listeners for interest chips to toggle their 'selected' state.
 * Also configures the 'Join Us!' button to trigger a splash screen animation
 * and then navigate to the introduction page.
 */
export function initializeInterest() {
  document.querySelectorAll("#proInterestPage .chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("selected"));
  });

  // Inside initializeInterest() after "Join Us!" button:
  const submit = document.getElementById("interestSubmitBtn");
  if (submit) {
    let locked = false;

    submit.addEventListener("click", async () => {
      if (locked) return;
      locked = true;

      const selected = Array.from(
        document.querySelectorAll("#proInterestPage .chip.selected"),
      )
        .map((c) => c.textContent.trim())
        .filter(Boolean);
      try {
        // Treat these as “aims” (fits your wording: “What do you want to achieve?”)
        await saveProfile({ aims: selected.join(", ") || null });
      } catch {
        void 0;
      }

      const splashContainer = document.getElementById("splashScreenContainer");
      const pageContainer = document.getElementById("page-content");

      // If we can't find the overlay, just go to Intro.
      if (!splashContainer) {
        loadPage("intro");
        return;
      }

      // Ensure clean state
      splashContainer.classList.remove("fade-out");
      splashContainer.innerHTML = "";

      // Load the fragment and show overlay
      fetch("html/splashscreen_mid.html")
        .then((r) => r.text())
        .then((html) => {
          splashContainer.innerHTML = html;

          // IMPORTANT: hide app content while splash is active
          if (pageContainer) pageContainer.style.display = "none";

          // Only visible when .active is present (per CSS below)
          splashContainer.classList.add("active");

          const logo =
            splashContainer.querySelector(".logo-one.mid-only") ||
            splashContainer.querySelector(".logo-one");

          // Expected timing: 3 * 1.3s spins + 0.8s shift = 4.7s (+small buffer)
          const EXPECTED_MS = 4700 + 300;
          const fallback = setTimeout(finish, EXPECTED_MS);

          /**
           * Handles the 'animationend' event for the splash screen logo.
           * @param {AnimationEvent} e - The animation event object.
           */
          function onAnimationEnd(e) {
            if (e.animationName === "midHold") {
              logo.removeEventListener("animationend", onAnimationEnd);
              clearTimeout(fallback);
              finish();
            }
          }

          /**
           * Completes the splash screen sequence by fading out the overlay
           * and navigating to the introduction page.
           */
          function finish() {
            // fade the overlay out
            splashContainer.classList.remove("active");
            splashContainer.classList.add("fade-out");

            // reveal app and show Intro
            if (pageContainer) pageContainer.style.display = "";
            loadPage("intro");

            // optional: clear overlay content after fade completes
            setTimeout(() => {
              splashContainer.classList.remove("fade-out");
              splashContainer.innerHTML = "";
              locked = false; // allow another click in future
            }, 600);
          }

          if (logo) {
            // Wait specifically for the finisher animation
            logo.addEventListener("animationend", onAnimationEnd);
          } else {
            clearTimeout(fallback);
            finish();
          }
        })
        .catch(() => {
          // If anything fails, don’t strand the user
          if (pageContainer) pageContainer.style.display = "";
          loadPage("intro");
          locked = false;
        });
    });
  }
}
