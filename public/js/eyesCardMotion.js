/** Hover layers keep the original image placement and animate only the subject. */
import { HEART_OUTLINE, HEART_GRAY, PEOPLE } from "./eyesCardArtwork.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const containQuery = window.matchMedia("(min-width: 768px)");
let nextMotionId = 0;
const ARTWORK = {
  "car_arclight.webp": [600, 397, 367, 58, 154, 339, "sway"],
  "car_history.webp": [599, 397, 350, 100, 235, 255, "write"],
  "car_visualacuity.webp": [604, 400, 338, 120, 239, 259, "focus"],
  "car_pupils.webp": [600, 397, 340, 100, 234, 235, "look"],
  "car_frontofeye.webp": [598, 393, 255, 125, 343, 220, "blink"],
  "car_fundalreflex.webp": [599, 397, 220, 168, 370, 120, "fundal-blink"],
  "car_ophth.webp": [600, 397, 393, 135, 145, 262, "sway"],
  "car_miniapp.webp": [601, 396, 371, 99, 230, 297, "tap"],
  "car_uncor.webp": [600, 397, 287, 160, 296, 136, "sway"],
  "car_cataract.webp": [600, 397, 305, 99, 258, 259, "cloud"],
  "car_glaucoma.webp": [600, 397, 304, 63, 235, 334, "nerve"],
  "car_diabetic.webp": [600, 397, 317, 78, 239, 319, "pulse"],
  "car_corneal.webp": [600, 396, 304, 106, 258, 258, "focus"],
  "car_childhood.webp": [604, 400, 265, 137, 339, 263, "glass"],
  "car_rop.webp": [600, 396, 332, 121, 244, 243, "pulse"],
  "car_retinal.webp": [610, 397, 348, 109, 262, 249, "scan"],
  "car_opticnerv.webp": [600, 397, 287, 93, 246, 304, "pulse"],
  "car_who.webp": [604, 400, 305, 128, 284, 272, "turn"],
  "car_childhoodscreen.webp": [604, 400, 265, 124, 339, 276, "people"],
  "car_paediatric.webp": [1409, 1116, 120, 140, 1130, 860, "hug"],
};

function element(name, attributes = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) =>
    node.setAttribute(key, value),
  );
  return node;
}

function updateFit(svg) {
  svg.setAttribute(
    "preserveAspectRatio",
    svg.dataset.motion === "hug" || containQuery.matches
      ? "xMidYMid meet"
      : "xMidYMid slice",
  );
}
containQuery.addEventListener("change", () => {
  document
    .querySelectorAll("#eyesCatalogPage .eyes-card__motion")
    .forEach(updateFit);
});

export function addEyesCardMotion(card, image, source) {
  const filename = source.split("/").pop();
  const artwork = ARTWORK[filename];
  if (!artwork) return;
  const [width, height, x, y, artWidth, artHeight, motion] = artwork;
  const id = "eyes-card-motion-" + ++nextMotionId;
  const svg = element("svg", {
    class: "eyes-card__motion",
    viewBox: "0 0 " + width + " " + height,
    width,
    height,
    "aria-hidden": "true",
    focusable: "false",
    "data-motion": motion,
  });
  updateFit(svg);
  const defs = element("defs");
  svg.append(defs);
  const rect = (a) => element("rect", a);
  const path = (d, a = {}) => element("path", { d, ...a });
  const circle = (cx, cy, r, a = {}) => element("circle", { cx, cy, r, ...a });
  const picture = (a = {}) =>
    element("image", { href: source, width, height, ...a });
  const reference = (key) => "url(#" + id + "-" + key + ")";
  const clip = (key, ...shapes) => {
    const node = element("clipPath", { id: id + "-" + key });
    node.append(...shapes);
    defs.append(node);
    return reference(key);
  };
  const mask = (key, ...shapes) => {
    const node = element("mask", {
      id: id + "-" + key,
      maskUnits: "userSpaceOnUse",
      x: 0,
      y: 0,
      width,
      height,
    });
    node.append(...shapes);
    defs.append(node);
    return reference(key);
  };
  const animate = (name, origin, primary = false) => {
    const group = element("g", {
      class: "eyes-card__animate" + (primary ? " eyes-card__motion-part" : ""),
      "data-part": name,
    });
    group.style.setProperty("--eyes-card-animation", "eyes-card-" + name);
    group.style.transformOrigin = origin;
    return group;
  };
  const bounds = { x, y, width: artWidth, height: artHeight };
  const artClip = clip("art", rect(bounds));
  const clearArt = () =>
    svg.append(picture(), rect({ ...bounds, fill: "#000" }));
  const plainPart = (name = motion) =>
    animate(name, x + artWidth / 2 + "px " + (y + artHeight / 2) + "px", true);

  if (motion === "fundal-blink") {
    // The source artwork runs off the right edge. Reuse its complete eye
    // for both positions so the composition fits in either direction.
    const eyeClip = clip(
      "complete-eye",
      rect({
        x: 214,
        y: 164,
        width: 234,
        height: 126,
      }),
    );
    svg.append(rect({ width, height, fill: "#000" }));
    const part = plainPart("blink");
    part.append(
      picture({
        "clip-path": eyeClip,
        transform: "translate(52 46) scale(.78)",
      }),
      picture({
        "clip-path": eyeClip,
        transform: "translate(238 46) scale(.78)",
      }),
    );
    svg.append(part);
  } else if (motion === "hug") {
    // Clip one opaque composition once; overlap the centre clips by four units.
    const outline = clip("heart", path(HEART_OUTLINE));
    const composition = element("g", { "clip-path": outline });
    composition.append(
      rect({ width, height, fill: "#b8b8b8" }),
      rect({ width: 705, height, fill: "#fdfdfd" }),
    );
    const left = animate("hug-left", "704px 558px");
    left.append(
      path(HEART_GRAY, {
        fill: "#b8b8b8",
        "clip-path": clip("left-arm", rect({ x: 0, y: 0, width: 706, height })),
      }),
    );
    const right = animate("hug-right", "704px 558px");
    right.append(
      path(HEART_OUTLINE + HEART_GRAY, {
        fill: "#fdfdfd",
        "fill-rule": "evenodd",
        "clip-path": clip(
          "right-arm",
          rect({ x: 702, y: 0, width: width - 702, height }),
        ),
      }),
    );
    composition.append(left, right);
    svg.append(composition);
  } else if (motion === "write") {
    svg.append(rect({ width, height, fill: "#000" }));
    const paperStyle = {
      fill: "none",
      stroke: "#fff",
      "stroke-width": 10,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    };
    svg.append(
      path(
        "M399 114H530Q533 114 533 117V338Q533 342 529 342H366Q363 342 363 339V147Z",
        paperStyle,
      ),
      path("M399 114V142Q399 147 394 147H364", paperStyle),
    );
    const lines = [
      [410, 153, 101, 15, 416, 160],
      [410, 180, 101, 15, 416, 187],
      [438, 207, 73, 15, 445, 214],
    ];
    lines.forEach(([lx, ly, lw, lh, inkX, inkY], index) => {
      const reveal = rect({
        x: lx,
        y: ly,
        width: lw,
        height: lh,
        class: "eyes-card__animate",
      });
      reveal.style.setProperty(
        "--eyes-card-animation",
        "eyes-card-line-" + (index + 1),
      );
      reveal.style.transformOrigin = lx + "px " + ly + "px";
      svg.append(
        path("M" + inkX + " " + inkY + "H503", {
          fill: "none",
          stroke: "#fff",
          "stroke-width": 11,
          "stroke-linecap": "round",
          "clip-path": clip("line-" + index, reveal),
          "data-part": "original-line-" + (index + 1),
        }),
      );
    });
    const pencil = animate("write", "468px 327px", true);
    const pencilStyle = {
      fill: "#fff",
      stroke: "#000",
      "stroke-width": 7,
      "stroke-linejoin": "round",
    };
    pencil.append(
      path(
        "M534 214L561 232L501 312L469 330Q465 333 466 327L477 294Z",
        pencilStyle,
      ),
      path(
        "M541 204L550 192Q553 188 557 191L571 201Q577 205 573 211L565 222Z",
        pencilStyle,
      ),
      path("M477 303L487 309L473 318Z", { fill: "#000" }),
    );
    svg.append(pencil);
  } else if (motion === "tap") {
    clearArt();
    const hand = plainPart("tap");
    const handClip = clip(
      "hand",
      rect({ x: 439, y: 149, width: 61, height: 160 }),
      rect({ x: 371, y: 244, width: 230, height: 152 }),
    );
    hand.append(
      path("M409 390H601V570H473Z", { fill: "#fff" }),
      picture({ "clip-path": handClip }),
    );
    svg.append(hand);
    const red = element("filter", {
      id: id + "-red",
      x: "0%",
      y: "0%",
      width: "100%",
      height: "100%",
      "color-interpolation-filters": "sRGB",
    });
    red.append(
      element("feColorMatrix", {
        type: "matrix",
        values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2 -2 0 0 0",
      }),
    );
    defs.append(red);
    const inside = clip(
      "inner-ring",
      element("ellipse", { cx: 470, cy: 187, rx: 64, ry: 65 }),
    );
    const outside = mask(
      "outer-ring",
      rect({ width, height, fill: "#fff" }),
      element("ellipse", { cx: 470, cy: 187, rx: 64, ry: 65, fill: "#000" }),
    );
    for (const [name, attributes] of [
      ["ripple-outer", { mask: outside }],
      ["ripple-inner", { "clip-path": inside }],
    ]) {
      const ripple = animate(name, "470px 187px");
      ripple.append(picture({ filter: reference("red"), ...attributes }));
      svg.append(ripple);
    }
  } else if (motion === "nerve") {
    svg.append(rect({ width, height, fill: "#000" }));
    svg.append(
      element("ellipse", {
        cx: 438,
        cy: 256,
        rx: 90,
        ry: 101,
        fill: "#efb450",
        stroke: "#fff",
        "stroke-width": 8,
        "data-part": "fixed-retina",
      }),
    );
    const disc =
      "M441 201C469 199 490 220 490 246C493 272 476 294 452 294C437 294 424 306 412 313C399 323 395 305 393 285C388 257 392 234 405 216C414 204 427 198 441 201Z";
    const gradient = element("linearGradient", {
      id: id + "-cream",
      x1: 0,
      y1: 1,
      x2: 1,
      y2: 0,
    });
    gradient.append(
      element("stop", { offset: 0, "stop-color": "#fff5cf" }),
      element("stop", { offset: 1, "stop-color": "#fffdf0" }),
    );
    defs.append(gradient);
    const part = animate("nerve", "441px 258px", true);
    part.append(
      path(disc, {
        fill: reference("cream"),
        stroke: "#96958d",
        "stroke-width": 8,
        "stroke-linejoin": "round",
      }),
      circle(413, 284, 6, { fill: "#c8c6b9" }),
      circle(453, 278, 7, { fill: "#c8c6b9" }),
    );
    svg.append(part);
    const vessels = element("g", {
      fill: "none",
      stroke: "#fff",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "data-part": "fixed-vessels",
    });
    vessels.append(
      path(
        "M453 76C466 105 482 139 473 161L460 201C453 222 454 233 447 244C441 260 451 272 469 287C485 301 511 350 509 405",
        { "stroke-width": 11 },
      ),
      path("M326 89C368 112 399 138 412 159L430 201C437 209 444 211 447 226", {
        "stroke-width": 7,
      }),
      path("M313 262C349 257 360 251 380 261C397 273 426 281 440 262", {
        "stroke-width": 4,
      }),
      path(
        "M445 278C437 293 426 300 420 305C421 313 446 314 443 329C437 353 423 382 407 406",
        { "stroke-width": 9 },
      ),
    );
    svg.append(
      vessels,
      path(
        "M356 373L359 361L366 360L366 350L377 350L382 336L376 329L386 325L391 337L397 333L399 346L389 350L388 360L380 355L372 365L366 363L362 375Z",
        { fill: "#f00" },
      ),
    );
  } else if (motion === "glass" || motion === "people") {
    // Idle and hover share opaque paths, with no bitmap edge fragments below.
    const glass = motion === "glass";
    svg.append(rect({ width, height, fill: "#000" }));
    const eye = element("g", { "data-part": "fixed-eye" });
    eye.append(
      path(
        glass
          ? "M283 235Q454 71 626 235Q454 399 283 235Z"
          : "M283 222Q453 58 624 222Q453 386 283 222Z",
        {
          fill: "none",
          stroke: "#fff",
          "stroke-width": 16,
          "stroke-linejoin": "round",
        },
      ),
      element("ellipse", {
        cx: glass ? 454 : 453,
        cy: glass ? 235 : 222,
        rx: glass ? 85 : 83,
        ry: glass ? 90 : 83,
        fill: "#fff",
      }),
      circle(glass ? 454 : 453, glass ? 235 : 222, glass ? 40 : 36, {
        fill: "#000",
      }),
    );
    svg.append(eye);
    const part = plainPart();
    if (glass) {
      part.style.transformOrigin = "513px 293px";
      part.append(
        circle(513, 293, 91, { fill: "#000" }),
        rect({ x: 504, y: 361, width: 19, height: 185, fill: "#fff" }),
        circle(513, 293, 64, {
          fill: "#000",
          stroke: "#fff",
          "stroke-width": 17,
        }),
      );
    } else {
      part.append(
        path(PEOPLE, {
          fill: "#fff",
          stroke: "#000",
          "stroke-width": 26,
          "stroke-linejoin": "round",
          "paint-order": "stroke",
          "fill-rule": "evenodd",
        }),
      );
    }
    svg.append(part);
  } else {
    clearArt();
    const part = plainPart();
    if (motion === "look") {
      svg.append(circle(456.5, 217, 111.5, { fill: "#fff" }));
      part.append(
        circle(456.5, 217, 55, { fill: "#000" }),
        circle(496.5, 185.5, 23, { fill: "#c7c7c7" }),
      );
    } else {
      if (filename === "car_arclight.webp" || filename === "car_ophth.webp") {
        const tool = filename === "car_arclight.webp";
        part.append(
          rect({
            x: tool ? 378 : 401.5,
            y: 388,
            width: tool ? 131 : 128,
            height: 220,
            fill: "#fff",
            "data-part": "body-extension",
          }),
        );
      }
      part.append(picture({ "clip-path": artClip }));
      if (motion === "sway")
        part.style.transformOrigin =
          x + artWidth / 2 + "px " + (y + artHeight * 0.8) + "px";
    }
    svg.append(part);
  }
  card.classList.add("eyes-card--motion");
  if (
    ["hug", "write", "nerve", "glass", "people", "fundal-blink"].includes(
      motion,
    )
  ) {
    card.classList.add("eyes-card--clean-art");
    svg.dataset.cleanArt = "true";
  }
  image.after(svg);
}
