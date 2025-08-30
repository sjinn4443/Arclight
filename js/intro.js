// js/intro.js
import { loadPage } from './navigation.js';

export function initializeIntro() {
  const seeWhatBtn = document.getElementById('seeWhatBtn');
  const skipBtn    = document.getElementById('skipBtn');

  const go = () => loadPage('dashboard'); // pre-split behavior: both go to dashboard

  if (seeWhatBtn) seeWhatBtn.addEventListener('click', go);
  if (skipBtn)    skipBtn.addEventListener('click', go);
}
