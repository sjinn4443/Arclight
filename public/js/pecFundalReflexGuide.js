const ASSETS = "/images/workshop/PEC/FundalReflexes/";
const WIDTH = 2382;
const HEIGHT = 1700;
const DURATION = 4200;

const CASES = [
  {
    name: "Normal",
    key: "normal",
    description: [
      "A normal eye reflects light from the retina, producing a visible fundal reflex.",
    ],
    reflex: true,
  },
  {
    name: "Cataract",
    key: "cataract",
    description: [
      "A cataract clouds the eye’s natural lens, blocking light travelling to and from the retina and reducing or obscuring the fundal reflex.",
    ],
  },
  {
    name: "Retinoblastoma",
    key: "retinoblastoma",
    description: [
      "Retinoblastoma is a malignant tumour arising from immature retinal cells. As it grows, a pale mass covers the normal red retinal background.",
      "Light reflects from the tumour instead of the normal retina, producing a white or yellow pupil reflex.",
    ],
    reflex: true,
  },
];

function copy(tag, key, fallback) {
  const element = document.createElement(tag);
  element.dataset.i18n = `pecWorkshop.${key}`;
  element.textContent =
    window.I18N?.t?.(element.dataset.i18n, fallback) || fallback;
  return element;
}

function panel(stack, title, key, index) {
  const article = document.createElement("article");
  article.className = "diabetic-screening-panel pec-reflex-panel";
  article.dataset.diabeticScrollStep = "";
  const heading = document.createElement("div");
  heading.className = "diabetic-screening-panel__text";
  const number = document.createElement("span");
  number.className = "diabetic-screening-step";
  number.textContent = String(index + 1).padStart(2, "0");
  heading.append(number, copy("h3", key, title));
  article.append(heading);
  stack.append(article);
  return article;
}

function layer(stage, filename, role, x, y, width, height) {
  const img = document.createElement("img");
  img.src = `${ASSETS}${filename}.webp`;
  img.alt = "";
  img.draggable = false;
  img.className = `pec-reflex-layer pec-reflex-layer--${role}`;
  img.style.cssText = `left:${(x / WIDTH) * 100}%;top:${(y / HEIGHT) * 100}%;width:${(width / WIDTH) * 100}%;height:${(height / HEIGHT) * 100}%`;
  stage.append(img);
  return img;
}

function playbackControl(host, signal, player, reducedMotion) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "childhood-fundal-stage-replay-btn pec-reflex-control";
  button.disabled = true;
  const icons = {
    replay:
      '<img class="childhood-fundal-stage-replay-btn__icon" src="/images/icon/base/replay.webp" alt="" aria-hidden="true" draggable="false">',
    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>',
  };
  let ready = false;
  let visible = false;
  let userPaused = false;
  let completed = false;
  let manual = false;
  const show = (state) => {
    if (button.dataset.playback === state) return;
    button.dataset.playback = state;
    button.innerHTML = icons[state];
    const key = `pecWorkshop.reflex_${state}`;
    const label =
      window.I18N?.t?.(
        key,
        `${state[0].toUpperCase()}${state.slice(1)} animation`,
      ) || state;
    button.dataset.i18n = `${key}:aria-label;${key}:title`;
    button.setAttribute("aria-label", label);
    button.title = label;
  };
  const sync = () => {
    if (!ready) return;
    if (completed || !visible || userPaused) {
      player.pause();
      show(completed ? "replay" : "play");
    } else if (reducedMotion && !manual) {
      completed = true;
      player.finish();
      show("replay");
    } else {
      player.play();
      show("pause");
    }
  };
  button.addEventListener(
    "click",
    () => {
      manual = true;
      if (button.dataset.playback === "pause") userPaused = true;
      else {
        userPaused = false;
        if (completed) {
          completed = false;
          player.restart();
        }
      }
      sync();
    },
    { signal },
  );
  show("play");
  host.append(button);
  return {
    setVisible(value) {
      visible = value;
      sync();
    },
    ready() {
      ready = true;
      button.disabled = false;
      sync();
    },
    complete() {
      completed = true;
      sync();
    },
    destroy() {
      player.destroy();
    },
  };
}

// Clip the stationary artwork to reveal/wipe it in the direction of light travel.
function track(element, frames) {
  const animation = element.animate(
    frames.map(([time, clipPath, opacity = 1]) => ({
      offset: time / DURATION,
      clipPath,
      opacity,
    })),
    { duration: DURATION, fill: "both", easing: "linear" },
  );
  animation.pause();
  return animation;
}

export function appendPecFundalReflexGuide(stack) {
  const abort = new AbortController();
  const { signal } = abort;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const controllers = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        controllers
          .get(target)
          ?.setVisible(isIntersecting && intersectionRatio >= 0.35);
      });
    },
    { threshold: [0, 0.35] },
  );

  for (const [index, item] of CASES.entries()) {
    const article = panel(stack, item.name, `reflex_${item.key}_title`, index);
    article.dataset.reflexCase = item.key;
    const stage = document.createElement("div");
    stage.className = "pec-reflex-stage";
    stage.setAttribute("role", "group");
    stage.setAttribute(
      "aria-label",
      `${item.name}: light travelling from the Arclight into the eye and reflecting back`,
    );
    article.append(stage);
    // All coordinates share the supplied 2382 × 1700 background canvas.
    layer(stage, `${item.name}Background`, "background", 0, 0, WIDTH, HEIGHT);
    const cataract = item.key === "cataract";
    const light = layer(
      stage,
      cataract ? "CataractLight" : "NormalandRetinoblastomaLight",
      "light",
      cataract ? 170 : 110,
      770,
      cataract ? 491 : 993,
      154,
    );
    const incoming = layer(
      stage,
      `${item.name}Arrow1`,
      "incoming",
      256,
      776,
      cataract ? 318 : 859,
      142,
    );
    const outgoing = layer(
      stage,
      `${item.name}Arrow2`,
      "outgoing",
      250,
      776,
      cataract ? 318 : item.key === "normal" ? 859 : 761,
      item.key === "normal" ? 143 : 142,
    );
    const reflex = item.reflex
      ? layer(
          stage,
          `${item.name}Reflex`,
          "reflex",
          1805,
          785,
          item.key === "normal" ? 127 : 128,
          127,
        )
      : null;
    layer(stage, "Arclight", "arclight", 82, 480, 112, 1477);

    const hiddenRight = "inset(0 100% 0 0)";
    const hiddenLeft = "inset(0 0 0 100%)";
    const shown = "inset(0 0 0 0)";
    const animations = [
      track(light, [
        [0, hiddenRight],
        [500, hiddenRight],
        [1300, shown],
        [DURATION, shown],
      ]),
      track(incoming, [
        [0, hiddenRight],
        [800, hiddenRight],
        [1600, shown],
        [2100, shown],
        [2700, hiddenLeft],
        [DURATION, hiddenLeft],
      ]),
      track(outgoing, [
        [0, hiddenLeft],
        [2400, hiddenLeft],
        [3400, shown],
        [DURATION, shown],
      ]),
    ];
    if (reflex)
      animations.push(
        track(reflex, [
          [0, shown, 0],
          [2900, shown, 0],
          [3300, shown, 1],
          [DURATION, shown, 1],
        ]),
      );
    const controller = playbackControl(
      stage,
      signal,
      {
        play: () => animations.forEach((animation) => animation.play()),
        pause: () => animations.forEach((animation) => animation.pause()),
        restart: () => animations.forEach((animation) => animation.cancel()),
        finish: () => animations.forEach((animation) => animation.finish()),
        destroy: () => animations.forEach((animation) => animation.cancel()),
      },
      reducedMotion,
    );
    animations[0].addEventListener("finish", () => controller.complete(), {
      signal,
    });
    controllers.set(stage, controller);
    item.description.forEach((text, index) =>
      article.append(
        copy("p", `reflex_${item.key}_description_${index + 1}`, text),
      ),
    );
    Promise.all(
      Array.from(stage.querySelectorAll("img"), (img) => img.decode()),
    )
      .then(() => {
        if (signal.aborted) return;
        controller.ready();
        observer.observe(stage);
      })
      .catch(() => {
        if (!signal.aborted)
          article.append(
            copy(
              "p",
              "reflex_load_error",
              "The animation could not load. Please reopen this lesson to try again.",
            ),
          );
      });
    if (item.key === "normal")
      appendVariations(article, controllers, observer, signal, reducedMotion);
  }

  const cleanup = () => {
    abort.abort();
    observer.disconnect();
    controllers.forEach((controller) => controller.destroy());
    controllers.clear();
  };
  window.addEventListener(
    "page:loaded",
    () => {
      if (!stack.isConnected) cleanup();
    },
    { signal },
  );
  return cleanup;
}

function appendVariations(
  article,
  controllers,
  observer,
  signal,
  reducedMotion,
) {
  const heading = copy("h3", "reflex_colours_title", "Normal reflex colours");
  heading.className = "pec-reflex-colours-heading";
  article.append(heading);
  const visual = document.createElement("div");
  visual.className = "pec-reflex-variations-frame";
  const stage = document.createElement("div");
  stage.className = "pec-reflex-variations";
  stage.setAttribute("role", "img");
  stage.setAttribute(
    "aria-label",
    "Normal fundal reflex colours with different pigmentation",
  );
  visual.append(stage);
  article.append(visual);
  let animation;
  const controller = playbackControl(
    visual,
    signal,
    {
      play: () => animation?.play(),
      pause: () => animation?.pause(),
      restart: () => animation?.goToAndStop(0, true),
      finish: () => animation?.goToAndStop(animation.totalFrames - 1, true),
      destroy: () => animation?.destroy(),
    },
    reducedMotion,
  );
  controllers.set(stage, controller);
  article.append(
    copy(
      "p",
      "reflex_colours_intro",
      "The normal fundal reflex varies with pigmentation.",
    ),
  );
  const list = document.createElement("ul");
  list.className = "pec-reflex-colour-list";
  [
    "Black: yellow / white / blue reflex",
    "White: orange / red reflex",
    "Asian: orange / yellow reflex",
  ].forEach((text, index) =>
    list.append(copy("li", `reflex_colours_${index + 1}`, text)),
  );
  article.append(list);
  void import("./childhoodFundalPreparation.js")
    .then(async ({ ensureLottie }) => {
      if (!(await ensureLottie())) throw new Error("Lottie unavailable");
      if (signal.aborted) return;
      animation = window.lottie.loadAnimation({
        container: stage,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/scrolly/coreexam/fundalreflex/exam/5/data.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          hideOnTransparent: false,
        },
      });
      animation.addEventListener("complete", () => controller.complete());
      animation.addEventListener("DOMLoaded", () => {
        if (signal.aborted) return;
        controller.ready();
        observer.observe(stage);
      });
      animation.addEventListener("data_failed", () => {
        if (!signal.aborted)
          article.append(
            copy(
              "p",
              "reflex_load_error",
              "The animation could not load. Please reopen this lesson to try again.",
            ),
          );
      });
    })
    .catch(() => {
      if (!signal.aborted)
        article.append(
          copy(
            "p",
            "reflex_load_error",
            "The animation could not load. Please reopen this lesson to try again.",
          ),
        );
    });
}
