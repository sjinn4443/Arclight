function getScrollRoot(node) {
  let current = node?.parentElement ?? null;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY || style.overflow;
    if (/(auto|scroll|overlay)/.test(overflowY)) return current;
    current = current.parentElement;
  }

  return window;
}

function getRootMetrics(scrollRoot) {
  if (scrollRoot === window) {
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  }

  const rect = scrollRoot.getBoundingClientRect();
  return {
    top: rect.top,
    height: scrollRoot.clientHeight || rect.height || 1,
  };
}

function isPageShown(page) {
  let node = page;
  while (node) {
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    node = node.parentElement;
  }
  return true;
}

function collectScrollySteps(page) {
  const selectors = [
    ".childhood-scrolly-hero",
    ".childhood-visual-dev-panel",
    ".childhood-normal-visual-dev-section",
    "#childhoodReferPage .childhood-refer",
    "#visualImpairmentPage .vi-scroll-wrap",
    "#visualImpairmentPage .vi-detail-panel",
    "#signsVICasesPage .childhood-signs-vi-panel",
  ];

  return Array.from(page.querySelectorAll(selectors.join(","))).filter(
    (step) => !step.closest("[aria-hidden='true']"),
  );
}

export function initializeChildhoodScrollyPages() {
  const pages = document.querySelectorAll(
    ".childhood-scrolly-page, #visualImpairmentPage, #childhoodReferPage",
  );

  pages.forEach((page) => {
    if (typeof page._childhoodScrollyCleanup === "function") {
      page._childhoodScrollyCleanup();
    }

    const steps = collectScrollySteps(page);
    if (!steps.length) return;

    steps.forEach((step) => step.classList.add("childhood-scrolly-step"));

    const controller = new AbortController();
    const { signal } = controller;
    const scrollRoot = getScrollRoot(page);
    let rafId = 0;

    const render = () => {
      rafId = 0;
      if (!isPageShown(page)) return;

      const rootMetrics = getRootMetrics(scrollRoot);
      const revealTop = rootMetrics.top + rootMetrics.height * 0.12;
      const revealBottom = rootMetrics.top + rootMetrics.height * 0.84;
      let hasCurrent = false;

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const intersects = rect.top < revealBottom && rect.bottom > revealTop;
        const shouldReveal =
          intersects || (index === 0 && rect.top < revealBottom);

        if (shouldReveal) step.classList.add("is-visible");

        if (intersects && !hasCurrent) {
          step.classList.add("is-current");
          hasCurrent = true;
        } else {
          step.classList.remove("is-current");
        }
      });
    };

    const scheduleRender = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(render);
    };

    const listen = (target, type, handler, options = {}) => {
      if (!target?.addEventListener) return;
      target.addEventListener(type, handler, { ...options, signal });
    };

    if (scrollRoot === window) {
      listen(window, "scroll", scheduleRender, { passive: true });
    } else {
      listen(scrollRoot, "scroll", scheduleRender, { passive: true });
    }

    listen(window, "resize", scheduleRender, { passive: true });
    listen(window, "orientationchange", scheduleRender, { passive: true });

    page.querySelectorAll("img, video").forEach((media) => {
      if (media.complete || media.readyState >= 2) return;
      listen(media, "load", scheduleRender, { once: true });
      listen(media, "loadeddata", scheduleRender, { once: true });
    });

    page._childhoodScrollyCleanup = () => {
      controller.abort();
      if (rafId) window.cancelAnimationFrame(rafId);
      delete page._childhoodScrollyCleanup;
    };

    window.requestAnimationFrame(scheduleRender);
  });
}
