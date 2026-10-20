(async () => {
  const $ = (id) => document.getElementById(id),
    assets = JSON.parse($("embedded-assets").textContent);
  try {
    const [THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] =
      await Promise.all([
        import("./vendor/three.module.js"),
        import("./vendor/GLTFLoader.js"),
        import("./vendor/OrbitControls.js"),
        import("./vendor/RoomEnvironment.js"),
      ]);
    const canvas = $("canvas"),
      container = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(32, 1, 0.02, 100);
    const pmrem = new THREE.PMREMGenerator(renderer),
      room = new RoomEnvironment();
    scene.environment = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfff4df, 0x333642, 1.25));
    const key = new THREE.DirectionalLight(0xffeee0, 2.2);
    key.position.set(-4, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe3efff, 0.9);
    fill.position.set(-1, 0, -4);
    scene.add(fill);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 1.45;
    controls.maxDistance = 15;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.7;
    controls.panSpeed = 0.55;
    const origin = new THREE.Vector3(-0.09, 10.5612869, 0);
    // GLB images use <img> so embedded textures follow img-src, without blob fetches.
    const gltfLoader = new GLTFLoader();
    gltfLoader.register((parser) => {
      parser.textureLoader = new THREE.TextureLoader(parser.options.manager)
        .setCrossOrigin(parser.options.crossOrigin)
        .setRequestHeader(parser.options.requestHeader);
      return { name: "ARCLIGHT_IMAGE_LOADER" };
    });
    const gltf = await gltfLoader.loadAsync("./eye-glaucoma.glb");
    const model = gltf.scene;
    model.position.copy(origin).multiplyScalar(-1);
    scene.add(model);
    let nerve, retina;
    model.traverse((o) => {
      if (o.userData.sourceName === "glaucoma nerve") nerve = o;
      if (o.userData.retinaProgression) retina = o;
    });
    if (!nerve || !retina) throw new Error("Required model parts are missing.");
    const scales = JSON.parse(nerve.userData.stageScales).map(
      (v) => new THREE.Vector3(...v),
    );
    const textureLoader = new THREE.TextureLoader();
    const stageTextures = await Promise.all(
      [1, 2, 3].map((stage) =>
        textureLoader.loadAsync("./retina-" + stage + ".png"),
      ),
    );
    for (const tex of stageTextures) {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
    const progression = { value: 0 },
      cupStage = { value: 0 },
      cupBlend = { value: 0 },
      cupAppearance = { value: 0 },
      retinaSelection = { value: 0 },
      discCue = { value: 0 },
      rimOuterScale = { value: 1.06 };
    // Match the original iris UV border: its median width at the desktop default
    // view is 3.2 CSS px. Keep that shared visual weight through zoom and resizing.
    const borderPixels = { value: 3.2 },
      pixelScale = { value: Math.min(devicePixelRatio, 2) },
      borderViewport = { value: new THREE.Vector2(1, 1) };
    const morph = assets.cupMorph,
      discUV = new THREE.Vector2(...morph.disc.center).divide(
        new THREE.Vector2(morph.width, morph.height),
      ),
      discPoint = new THREE.Vector3(),
      cupPoint = new THREE.Vector3();
    const ratioMarker = {
      start: [0, 0],
      end: [0, 0],
      mid: [0, 0],
      world: [0, 0, 0],
    };
    let annotationReady = false;
    // Trace the bright central cup in each original image. Only this contour moves;
    // the disc border, rim texture and surrounding retinal vessels stay anchored.
    const contourBytes = new Uint8Array(morph.angles * 4 * 4);
    morph.stages.forEach((stage, j) =>
      stage.radii.forEach((r, i) => {
        const k = (j * morph.angles + i) * 4;
        contourBytes[k] = contourBytes[k + 1] = contourBytes[k + 2] = r;
        contourBytes[k + 3] = 255;
      }),
    );
    morph.disc.contour.forEach((r, i) => {
      const k = (3 * morph.angles + i) * 4;
      contourBytes[k] = contourBytes[k + 1] = contourBytes[k + 2] = r;
      contourBytes[k + 3] = 255;
    });
    const cupContours = new THREE.DataTexture(
      contourBytes,
      morph.angles,
      4,
      THREE.RGBAFormat,
    );
    cupContours.minFilter = cupContours.magFilter = THREE.LinearFilter;
    cupContours.wrapS = THREE.RepeatWrapping;
    cupContours.generateMipmaps = false;
    cupContours.needsUpdate = true;
    const retinaMeshes = [];
    retina.traverse((o) => {
      if (o.isMesh) retinaMeshes.push(o);
    });
    if (!retinaMeshes.length && retina.isMesh) retinaMeshes.push(retina);
    for (const mesh of retinaMeshes) {
      const originals = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      const updated = originals.map((old) => {
        const mat = new THREE.MeshBasicMaterial({
          map: stageTextures[0],
          side: old.side,
          toneMapped: false,
        });
        mat.extensions = { derivatives: true };
        mat.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, { borderPixels, pixelScale });
          Object.assign(shader.uniforms, {
            cupStage,
            cupBlend,
            cupAppearance,
            retinaSelection,
            discCue,
            rimOuterScale,
            solidBorderTint: { value: new THREE.Color("#60e8ef") },
            cueBorderTint: { value: new THREE.Color("#f25600") },
            cupContours: { value: cupContours },
            contourCount: { value: morph.angles },
            contourScale: { value: morph.radiusEncoding },
            mapSize: {
              value: new THREE.Vector2(morph.width, morph.height),
            },
            discCenter: {
              value: new THREE.Vector2(...morph.disc.center),
            },
            discRadii: { value: new THREE.Vector2(...morph.disc.radii) },
            stageTwo: { value: stageTextures[1] },
            stageThree: { value: stageTextures[2] },
            cupCenter0: {
              value: new THREE.Vector2(...morph.stages[0].center),
            },
            cupCenter1: {
              value: new THREE.Vector2(...morph.stages[1].center),
            },
            cupCenter2: {
              value: new THREE.Vector2(...morph.stages[2].center),
            },
          });
          shader.fragmentShader =
            `uniform float cupStage;
uniform float cupBlend;
uniform float cupAppearance;
uniform float retinaSelection;
uniform float discCue;
uniform float rimOuterScale;
uniform float borderPixels;
uniform float pixelScale;
uniform vec3 solidBorderTint;
uniform vec3 cueBorderTint;
uniform sampler2D cupContours;
uniform sampler2D stageTwo;
uniform sampler2D stageThree;
uniform float contourCount;
uniform float contourScale;
uniform vec2 mapSize;
uniform vec2 discCenter;
uniform vec2 discRadii;
uniform vec2 cupCenter0;
uniform vec2 cupCenter1;
uniform vec2 cupCenter2;
float cupRadius(float angle,float stage){
 return texture2D(cupContours,vec2(fract(angle/6.28318530718+.5/contourCount),(stage+.5)/4.0)).r*contourScale;
}
float screenLine(float distance,float width){
 float gradient=max(length(vec2(dFdx(distance),dFdy(distance))),.00001);
 return 1.0-smoothstep(width*.5,width*.5+.75,abs(distance)/gradient/pixelScale);
}
` + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            `
#ifdef USE_MAP
 vec2 pixel=vMapUv*mapSize;
 vec2 centerA=cupStage<.5?cupCenter0:cupCenter1;
 vec2 centerB=cupStage<.5?cupCenter1:cupCenter2;
 vec2 currentCenter=mix(centerA,centerB,cupBlend),delta=pixel-currentCenter;
 float angle=atan(delta.y,delta.x);
 float radiusA=cupRadius(angle,cupStage),radiusB=cupRadius(angle,cupStage+1.0);
 float currentRadius=mix(radiusA,radiusB,cupBlend),distanceToCup=length(delta);
 float cupFill=1.0-smoothstep(currentRadius-.45,currentRadius+.65,distanceToCup);
 vec2 discDelta=pixel-discCenter;
 float discBoundary=discRadii.x,distanceToDisc=length(discDelta);
 float discFill=1.0-smoothstep(discBoundary-.45,discBoundary+.55,distanceToDisc);
 float discEdge=smoothstep(discBoundary-1.1,discBoundary-.25,distanceToDisc)*(1.0-smoothstep(discBoundary+.25,discBoundary+1.1,distanceToDisc));
 // Exclude the cup and its antialias fringe from the rim selection entirely.
 float rimBoundary=discBoundary*rimOuterScale;
 float rimFill=(1.0-smoothstep(rimBoundary-.45,rimBoundary+.55,distanceToDisc))*smoothstep(currentRadius+.65,currentRadius+1.25,distanceToCup);
 float rimBand=rimFill*smoothstep(rimBoundary-4.5,rimBoundary-3.0,distanceToDisc);
 float cupEdge=smoothstep(currentRadius-1.1,currentRadius-.25,distanceToCup)*(1.0-smoothstep(currentRadius+.25,currentRadius+1.1,distanceToCup));
 vec4 tissue=texture2D(map,vMapUv);
 if(cupFill>0.0){
  // Both samples share the SAME moving boundary. Grow the first cup first,
  // then hand over aligned surface detail to the next original cup image.
  vec2 uvA=(centerA+delta*(radiusA/max(currentRadius,.1)))/mapSize;
  vec2 uvB=(centerB+delta*(radiusB/max(currentRadius,.1)))/mapSize;
  vec4 a=cupStage<.5?texture2D(map,uvA):texture2D(stageTwo,uvA);
  vec4 b=cupStage<.5?texture2D(stageTwo,uvB):texture2D(stageThree,uvB);
  tissue=mix(tissue,mix(a,b,cupAppearance),cupFill);
 }
 tissue.rgb=mix(vec3(0.34,0.14,0.11),tissue.rgb,0.72);
 vec3 cueTint=mix(vec3(.20,.88,.90),vec3(.949,.337,0.0),discCue);
 float selectedMask=0.0;
 if(retinaSelection>.5&&retinaSelection<1.5)selectedMask=discFill*.42+discEdge*.60;
 if(retinaSelection>1.5&&retinaSelection<2.5)selectedMask=cupFill*.48+cupEdge*.60;
 if(retinaSelection>2.5&&retinaSelection<3.5)selectedMask=rimBand*.78;
 // Ratio mode shows both boundaries as thin cyan context for the heavier I marker.
 if(retinaSelection>3.5){
  float ratioContext=max(screenLine(distanceToDisc-discBoundary,borderPixels*.55),screenLine(distanceToCup-currentRadius,borderPixels*.55));
  tissue.rgb=mix(tissue.rgb,solidBorderTint,ratioContext*.55);
 }
 tissue.rgb=mix(tissue.rgb,cueTint,clamp(selectedMask,0.0,.9));
 // Opaque borders replace the image color rather than tinting it.
 float solidBorder=0.0;
 if(retinaSelection>.5&&retinaSelection<1.5)solidBorder=screenLine(distanceToDisc-discBoundary,borderPixels);
 if(retinaSelection>1.5&&retinaSelection<2.5)solidBorder=screenLine(distanceToCup-currentRadius,borderPixels);
 if(retinaSelection>2.5&&retinaSelection<3.5&&distanceToCup>currentRadius+1.25)solidBorder=max(screenLine(distanceToDisc-rimBoundary,borderPixels),screenLine(distanceToDisc-(rimBoundary-4.5),borderPixels));
 if(retinaSelection>3.5){
  // A capped I-shaped marker spans the gap between the cup and disc.
  // Its native image coordinates keep it attached to the retinal surface.
  float markerY=currentCenter.y;
  float markerStart=discCenter.x-sqrt(max(.01,discBoundary*discBoundary-(markerY-discCenter.y)*(markerY-discCenter.y)))+1.0;
  float leftCupRadius=mix(cupRadius(3.14159265359,cupStage),cupRadius(3.14159265359,cupStage+1.0),cupBlend);
  float markerEnd=currentCenter.x-leftCupRadius-1.0;
  float markerWidth=borderPixels*1.65;
  float markerStem=screenLine(pixel.y-markerY,markerWidth)*step(markerStart,pixel.x)*step(pixel.x,markerEnd);
  float markerCaps=max(screenLine(pixel.x-markerStart,markerWidth),screenLine(pixel.x-markerEnd,markerWidth))*step(abs(pixel.y-markerY),3.0);
  if(markerEnd>markerStart)solidBorder=max(markerStem,markerCaps);
 }
 tissue.rgb=mix(tissue.rgb,mix(solidBorderTint,cueBorderTint,discCue),solidBorder);
 diffuseColor*=tissue;
#endif`,
          );
        };
        mat.customProgramCacheKey = () =>
          "retina-screen-borders-ratio-marker-v7";
        return mat;
      });
      mesh.material = Array.isArray(mesh.material) ? updated : updated[0];
    }
    // Preserve the original yellow nerve, unaffected by lights or ACES exposure.
    const nerveMeshes = new Set();
    nerve.traverse((mesh) => {
      if (mesh.isMesh) {
        nerveMeshes.add(mesh);
        const materials = (
          Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        ).map(
          (old) =>
            new THREE.MeshBasicMaterial({
              color: "#edc78b",
              side: old.side,
              toneMapped: false,
            }),
        );
        mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
      }
    });
    // Compress light on the white posterior sheaths; the accent nerve stays unlit.
    // The coat mesh also contains the globe, so keep this spatially restricted.
    const nerveShadingMeshes = [];
    model.updateMatrixWorld(true);
    model.traverse((mesh) => {
      if (
        !mesh.isMesh ||
        nerveMeshes.has(mesh) ||
        new THREE.Box3().setFromObject(mesh).max.x < 1.2
      )
        return;
      const materials = (
        Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      ).map((original) => {
        const material = original.clone(),
          before = original.onBeforeCompile;
        material.onBeforeCompile = (shader) => {
          before.call(material, shader);
          shader.vertexShader =
            "varying float nerveRegionX;\n" +
            shader.vertexShader.replace(
              "#include <project_vertex>",
              "#include <project_vertex>\nnerveRegionX=(modelMatrix*vec4(transformed,1.0)).x;",
            );
          shader.fragmentShader =
            "varying float nerveRegionX;\n" +
            shader.fragmentShader.replace(
              "#include <tonemapping_fragment>",
              `float nerveRegion=smoothstep(1.12,1.42,nerveRegionX);
vec3 nerveLight=gl_FragColor.rgb*.58;
nerveLight=nerveLight/(vec3(1.0)+nerveLight*.20);
gl_FragColor.rgb=mix(gl_FragColor.rgb,nerveLight,nerveRegion);
#include <tonemapping_fragment>`,
            );
        };
        material.customProgramCacheKey = () => "posterior-nerve-soft-light-v1";
        return material;
      });
      mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
      nerveShadingMeshes.push(mesh.userData.sourceName || mesh.name);
    });
    const duration = 24;
    let progress = 0,
      playing = false,
      speed = 1,
      direction = 1,
      dwell = 0,
      last = performance.now(),
      ready = false,
      anatomyMode = true,
      selectedPart = -1,
      labelsEnabled = true,
      cueRemaining = 0,
      cueHold = 0,
      autoFit = true,
      lastStage = "";
    const mobile = () =>
      matchMedia("(max-width:760px), (max-height:500px) and (pointer:coarse)")
        .matches;
    const smooth = (t) => t * t * (3 - 2 * t),
      stageButtons = [...document.querySelectorAll("[data-stage]")];
    function applyProgress(value) {
      progress = Math.max(0, Math.min(1, value));
      progression.value = progress;
      const segment = progress <= 0.5 ? 0 : 1,
        t = smooth(segment === 0 ? progress * 2 : progress * 2 - 1);
      nerve.scale.copy(scales[segment]).lerp(scales[segment + 1], t);
      cupStage.value = segment;
      cupBlend.value = t;
      cupAppearance.value = THREE.MathUtils.smoothstep(t, 0.5, 0.98);
      if (annotationReady) updateDiscAnnotations();
      $("progress").value = Math.round(progress * 1000);
      $("progress").setAttribute(
        "aria-valuetext",
        (1 + progress * 2).toFixed(2) + " stage",
      );
      if (!playing)
        $("play").textContent = anatomyMode
          ? "Start progression"
          : progress >= 1
            ? "Replay"
            : "Play";
      const seconds = Math.round(progress * duration);
      $("clock").textContent =
        "0:" + String(seconds).padStart(2, "0") + " / 0:24";
      const stageNumber = progress < 0.25 ? 1 : progress < 0.75 ? 2 : 3;
      const title = anatomyMode ? "ANATOMY" : "STAGE " + stageNumber + " / 3";
      if (title !== lastStage) {
        $("stage").textContent = title;
        $("stage").classList.remove("changed");
        void $("stage").offsetWidth;
        $("stage").classList.add("changed");
        lastStage = title;
      }
      stageButtons.forEach((b, i) => {
        b.classList.toggle("active", !anatomyMode && i === stageNumber - 1);
        b.setAttribute(
          "aria-current",
          !anatomyMode && i === stageNumber - 1 ? "step" : "false",
        );
      });
    }
    function setPlaying(value) {
      if (value && anatomyMode) leaveAnatomy();
      playing = value;
      $("play").textContent = playing
        ? "Pause"
        : anatomyMode
          ? "Start progression"
          : progress >= 1
            ? "Replay"
            : "Play";
      $("play").setAttribute("aria-pressed", String(playing));
    }
    function resetView() {
      autoFit = true;
      controls.target.set(0.75, 0.03, 0);
      camera.position
        .copy(
          new THREE.Vector3(-5.568, 2.0821, 3.1718)
            .normalize()
            .multiplyScalar(6),
        )
        .add(controls.target);
      camera.up.set(0, 1, 0);
      controls.update();
      fitModel();
    }
    const fitPoints = [];
    model.updateMatrixWorld(true);
    model.traverse((o) => {
      if (o.isMesh) {
        const p = o.geometry.attributes.position;
        for (let i = 0; i < p.count; i++)
          fitPoints.push(
            new THREE.Vector3()
              .fromBufferAttribute(p, i)
              .applyMatrix4(o.matrixWorld),
          );
      }
    });
    function screenBounds(points = fitPoints) {
      camera.updateMatrixWorld();
      const all = points.map((p) => p.clone().project(camera));
      return {
        left: Math.min(...all.map((p) => p.x)),
        right: Math.max(...all.map((p) => p.x)),
        top: Math.max(...all.map((p) => p.y)),
        bottom: Math.min(...all.map((p) => p.y)),
      };
    }
    function fitModel() {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (w < 1 || h < 1) return;
      // Side rails have dedicated room on desktop; mobile parts live below the canvas.
      const lane =
        !mobile() && labelsEnabled ? (innerWidth <= 1080 ? 108 : 122) + 24 : 16;
      const xLimit = Math.max(0.18, 1 - (2 * lane) / w),
        yLimit = Math.max(0.25, 1 - (2 * (mobile() ? 16 : 42)) / h);
      const direction = camera.position
        .clone()
        .sub(controls.target)
        .normalize();
      let distance = 2.8;
      for (let i = 0; i < 85; i++) {
        camera.position
          .copy(controls.target)
          .addScaledVector(direction, distance);
        camera.lookAt(controls.target);
        camera.updateMatrixWorld();
        const b = screenBounds();
        if (
          b.left >= -xLimit &&
          b.right <= xLimit &&
          b.top <= yLimit &&
          b.bottom >= -yLimit
        )
          break;
        distance *= 1.035;
      }
      controls.update();
    }
    function resize() {
      const width = container.clientWidth,
        height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      borderViewport.value.set(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (autoFit && camera.position.distanceTo(controls.target) > 1)
        fitModel();
    }
    controls.addEventListener("start", () => {
      autoFit = false;
    });
    new ResizeObserver(resize).observe(container);
    resize();
    resetView();
    applyProgress(0);
    $("reset").onclick = resetView;
    $("play").onclick = () => {
      if (anatomyMode || (!playing && progress >= 1)) {
        startProgression();
        return;
      }
      setPlaying(!playing);
    };
    $("restart").onclick = showAnatomy;
    $("speed").onchange = () => {
      speed = Number($("speed").value);
    };
    $("loop").onchange = () => {
      if (!$("loop").checked) {
        direction = 1;
        dwell = 0;
      }
    };
    $("progress").oninput = () => {
      cancelCue();
      dwell = 0;
      applyProgress(Number($("progress").value) / 1000);
    };
    stageButtons.forEach(
      (button) =>
        (button.onclick = () => {
          cancelCue();
          dwell = 0;
          applyProgress(Number(button.dataset.stage));
        }),
    );
    canvas.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const offset = camera.position.clone().sub(controls.target),
          sphere = new THREE.Spherical().setFromVector3(offset);
        if (e.key === "ArrowLeft") sphere.theta -= 0.12;
        if (e.key === "ArrowRight") sphere.theta += 0.12;
        if (e.key === "ArrowUp") sphere.phi -= 0.12;
        if (e.key === "ArrowDown") sphere.phi += 0.12;
        sphere.makeSafe();
        camera.position
          .copy(controls.target)
          .add(new THREE.Vector3().setFromSpherical(sphere));
        controls.update();
      } else if (["+", "=", "-", "_"].includes(e.key)) {
        e.preventDefault();
        const offset = camera.position.clone().sub(controls.target);
        offset.multiplyScalar(e.key === "-" || e.key === "_" ? 1.12 : 0.9);
        offset.clampLength(controls.minDistance, controls.maxDistance);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      }
    });

    const anatomyParts = [
      {
        name: "Cornea",
        point: [-1.25, 0.12, 0.04],
        side: "left",
        row: 0.26,
        description:
          "The clear front surface of the eye. It lets light in and helps bend it toward the retina.",
      },
      {
        name: "Iris",
        point: [-1.0, -0.14, -0.05],
        side: "left",
        row: 0.43,
        description:
          "The colored ring around the pupil. It changes the size of the pupil to control how much light enters.",
      },
      {
        name: "Pupil",
        point: [-0.914, -0.014, -0.045],
        side: "left",
        row: 0.59,
        description:
          "The opening at the center of the iris. The cyan outline follows its inner edge in this cutaway view.",
      },
      {
        name: "Lens",
        point: [-0.806, 0.004, -0.05],
        side: "left",
        row: 0.76,
        description:
          "A clear structure behind the iris. Working with the cornea, it helps focus light on the retina.",
      },
      {
        name: "Retina",
        point: [0.24, -0.52, 0.69],
        side: "right",
        row: 0.7,
        description:
          "The light-sensitive inner lining at the back of the eye. It converts incoming light into electrical signals.",
      },
      {
        name: "Optic nerve",
        point: [2.45, 0.05, 0.08],
        side: "right",
        row: 0.16,
        description:
          "The bundle of nerve fibers leaving the back of the eye. Here the nerve bundle and the bright central cup in the retinal image are highlighted together.",
      },
      {
        name: "Optic disc",
        point: [1.02654, -0.24072, -0.09699],
        side: "right",
        row: 0.44,
        description:
          "The entire pale circular optic nerve head on the retina. It includes the central optic cup and the surrounding neuroretinal rim.",
      },
      {
        name: "Sclera",
        point: [-0.15, 1.03, 0.05],
        side: "left",
        row: 0.1,
        description:
          "The white outer coat of the eye. It helps protect the eye and maintain its shape.",
      },
      {
        name: "Optic cup",
        point: [1.035, -0.235, 0.04],
        side: "right",
        description:
          "The central depression within the optic disc, shown as the brightest central region in these images. The animation enlarges this cup while keeping the outer disc in place.",
      },
      {
        name: "Neuroretinal rim",
        label: "Rim",
        point: [1.02, -0.2, -0.2],
        side: "right",
        description:
          "The nerve tissue between the cup boundary and the outer disc boundary. In glaucoma, this tissue can thin as cupping increases. A narrow band at the disc margin is highlighted; the central cup is left clear.",
      },
      {
        name: "Cup-to-disc ratio",
        label: "C:D ratio",
        point: [1.02654, -0.24072, -0.09699],
        side: "right",
        description:
          "The vertical cup diameter divided by the vertical disc diameter. Compare both boundaries in the same direction. The diagram compares the C and D diameters. On the model, the highlighted bracket sits between the cup and disc boundaries.",
      },
    ];
    const overview =
      "Light enters through the cornea and pupil. The lens helps focus it on the retina, where light becomes electrical signals. The optic nerve carries these signals to the brain.";
    function createLabelLeader(target) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      line.setAttribute("stroke", "#f25600a0");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("fill", "none");
      line.setAttribute("stroke-linejoin", "round");
      line.setAttribute("data-target", target);
      $("label-lines").append(line);
      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      dot.setAttribute("r", "3");
      dot.setAttribute("fill", "#f25600");
      dot.setAttribute("data-target", target);
      $("label-lines").append(dot);
      return { line, dot };
    }
    const labelEntries = anatomyParts.map((part, index) => {
      const button = document.createElement("button");
      button.className = "part-label";
      button.textContent = part.label || part.name;
      button.setAttribute(
        "aria-label",
        "Learn about the " + part.name.toLowerCase(),
      );
      button.onclick = () => selectPart(index);
      $("labels-layer").append(button);
      const { line, dot } = createLabelLeader(
          index === 5 ? "nerve bundle" : part.name,
        ),
        retinalLeader = index === 5 ? createLabelLeader("retinal cup") : null;
      if (retinalLeader)
        retinalLeader.line.style.display = retinalLeader.dot.style.display =
          "none";
      const indexButton = document.createElement("button");
      indexButton.textContent = part.label || part.name;
      indexButton.onclick = () => selectPart(index);
      $("part-index").append(indexButton);
      return {
        button,
        line,
        dot,
        retinalLeader,
        indexButton,
        point: new THREE.Vector3(...part.point),
      };
    });

    // Highlight the model surfaces rather than only the text label.
    const highlightOverlays = [],
      highlightUniforms = [];
    const highlightColor = new THREE.Color("#60e8ef");
    model.updateMatrixWorld(true);
    const sources = {};
    model.traverse((o) => {
      if (o.userData.sourceName) sources[o.userData.sourceName] = o;
    });
    const uvTriangleCache = new WeakMap();
    function pointAtUV(mesh, uv, cacheSlot = "default") {
      const positions = mesh.geometry.attributes.position,
        texcoords = mesh.geometry.attributes.uv,
        indices = mesh.geometry.index;
      if (!texcoords) return null;
      const p = new THREE.Vector3(uv.x, uv.y, 0),
        weights = new THREE.Vector3(),
        count = indices ? indices.count : positions.count;
      let cache = uvTriangleCache.get(mesh);
      if (!cache) {
        cache = new Map();
        uvTriangleCache.set(mesh, cache);
      }
      function hitTriangle(i) {
        const ids = [0, 1, 2].map((k) =>
            indices ? indices.getX(i + k) : i + k,
          ),
          tri = ids.map(
            (k) => new THREE.Vector3(texcoords.getX(k), texcoords.getY(k), 0),
          );
        if (
          THREE.Triangle.getBarycoord(p, ...tri, weights) &&
          weights.x >= 0 &&
          weights.y >= 0 &&
          weights.z >= 0
        ) {
          const result = new THREE.Vector3();
          ids.forEach((id, k) =>
            result.addScaledVector(
              new THREE.Vector3().fromBufferAttribute(positions, id),
              weights.getComponent(k),
            ),
          );
          cache.set(cacheSlot, i);
          return mesh.localToWorld(result);
        }
        return null;
      }
      const cached = cache.get(cacheSlot);
      if (cached !== undefined) {
        const hit = hitTriangle(cached);
        if (hit) return hit;
      }
      for (let i = 0; i < count; i += 3) {
        const hit = hitTriangle(i);
        if (hit) return hit;
      }
      return null;
    }
    discPoint.set(1.02654, -0.24072, -0.09699);
    for (const mesh of retinaMeshes) {
      const p = pointAtUV(mesh, discUV);
      if (p) {
        discPoint.copy(p);
        break;
      }
    }
    labelEntries[6].point.copy(discPoint);
    labelEntries[10].point.copy(discPoint);
    const rimTop = morph.disc.radius * rimOuterScale.value - 2.0;
    for (const mesh of retinaMeshes) {
      const p = pointAtUV(
        mesh,
        new THREE.Vector2(
          morph.disc.center[0] / morph.width,
          (morph.disc.center[1] - rimTop) / morph.height,
        ),
      );
      if (p) {
        labelEntries[9].point.copy(p);
        break;
      }
    }
    function textureContourRadius(r, angle) {
      const f = ((((angle / (Math.PI * 2)) % 1) + 1) % 1) * morph.angles,
        i = Math.floor(f),
        t = f - i;
      return (
        (THREE.MathUtils.lerp(
          r[i % morph.angles],
          r[(i + 1) % morph.angles],
          t,
        ) /
          255) *
        morph.radiusEncoding
      );
    }
    function contourRadius(stage, angle) {
      return textureContourRadius(morph.stages[stage].radii, angle);
    }
    function updateDiscAnnotations() {
      const a = cupStage.value,
        b = a + 1,
        t = cupBlend.value,
        center = new THREE.Vector2(...morph.stages[a].center).lerp(
          new THREE.Vector2(...morph.stages[b].center),
          t,
        );
      for (const mesh of retinaMeshes) {
        const p = pointAtUV(
          mesh,
          center.clone().divide(new THREE.Vector2(morph.width, morph.height)),
          "cup",
        );
        if (p) {
          cupPoint.copy(p);
          labelEntries[8].point.copy(p);
          break;
        }
      }
      const markerLeftRadius = THREE.MathUtils.lerp(
          contourRadius(a, Math.PI),
          contourRadius(b, Math.PI),
          t,
        ),
        markerDiscLeft =
          morph.disc.center[0] -
          Math.sqrt(
            Math.max(
              0.01,
              morph.disc.radius ** 2 - (center.y - morph.disc.center[1]) ** 2,
            ),
          );
      ratioMarker.start = [markerDiscLeft + 1, center.y];
      ratioMarker.end = [center.x - markerLeftRadius - 1, center.y];
      ratioMarker.mid = [
        (ratioMarker.start[0] + ratioMarker.end[0]) / 2,
        center.y,
      ];
      for (const mesh of retinaMeshes) {
        const p = pointAtUV(
          mesh,
          new THREE.Vector2(
            ratioMarker.mid[0] / morph.width,
            ratioMarker.mid[1] / morph.height,
          ),
          "ratio",
        );
        if (p) {
          labelEntries[10].point.copy(p);
          ratioMarker.world = p.toArray();
          break;
        }
      }
      const scaleX = 48 / morph.disc.radii[0],
        scaleY = 46 / morph.disc.radii[1],
        cx = 74 + (center.x - morph.disc.center[0]) * scaleX,
        cy = 58 + (center.y - morph.disc.center[1]) * scaleY;
      const right =
          THREE.MathUtils.lerp(contourRadius(a, 0), contourRadius(b, 0), t) *
          scaleX,
        left =
          THREE.MathUtils.lerp(
            contourRadius(a, Math.PI),
            contourRadius(b, Math.PI),
            t,
          ) * scaleX,
        top =
          THREE.MathUtils.lerp(
            contourRadius(a, -Math.PI / 2),
            contourRadius(b, -Math.PI / 2),
            t,
          ) * scaleY,
        bottom =
          THREE.MathUtils.lerp(
            contourRadius(a, Math.PI / 2),
            contourRadius(b, Math.PI / 2),
            t,
          ) * scaleY;
      for (const [k, v] of Object.entries({
        cx: cx + (right - left) / 2,
        cy: cy + (bottom - top) / 2,
        rx: (right + left) / 2,
        ry: (top + bottom) / 2,
      }))
        $("diagram-cup").setAttribute(k, v);
      $("diagram-cup-bracket").setAttribute(
        "d",
        `M 19 ${cy - top} h 6 M 22 ${cy - top} V ${cy + bottom} M 19 ${cy + bottom} h 6`,
      );
      $("diagram-cup-letter").setAttribute("y", cy + 4);
      for (const button of document.querySelectorAll("[data-reference]")) {
        const active =
          Math.abs(Number(button.dataset.reference) - progress) < 0.02;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      }
    }
    annotationReady = true;
    updateDiscAnnotations();
    // Triangular ribbons keep a true, opaque silhouette even on the lens's flat
    // cut surface. Extrusion happens in screen space, so every border matches the original iris at 3.2 CSS px.
    const outlineEntries = [],
      silhouetteCache = new WeakMap();
    function screenStroke(capacity, region = "") {
      const geometry = new THREE.BufferGeometry();
      for (const [name, size] of [
        ["position", 3],
        ["otherEnd", 3],
        ["uv", 2],
        ["strokeSide", 2],
      ])
        geometry.setAttribute(
          name,
          new THREE.BufferAttribute(
            new Float32Array(capacity * 6 * size),
            size,
          ).setUsage(THREE.DynamicDrawUsage),
        );
      geometry.setDrawRange(0, 0);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          tint: { value: highlightColor },
          borderPixels,
          borderViewport,
        },
        depthTest: true,
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
        vertexShader: `attribute vec3 otherEnd;attribute vec2 strokeSide;uniform float borderPixels;uniform vec2 borderViewport;varying vec3 eyePoint;varying vec2 surfaceUV;
 void main(){
  vec4 a=projectionMatrix*modelViewMatrix*vec4(position,1.0),b=projectionMatrix*modelViewMatrix*vec4(otherEnd,1.0);
  vec2 direction=(b.xy/b.w-a.xy/a.w)*borderViewport;
  direction=length(direction)>.0001?normalize(direction):vec2(1.0,0.0);
  vec2 offset=(vec2(-direction.y,direction.x)*strokeSide.y+direction*strokeSide.x)*borderPixels/borderViewport;
  a.xy+=offset*a.w;gl_Position=a;
  eyePoint=(modelMatrix*vec4(position,1.0)).xyz;surfaceUV=uv;
 }`,
        fragmentShader:
          "uniform vec3 tint;varying vec3 eyePoint;varying vec2 surfaceUV;void main(){" +
          region +
          "gl_FragColor=vec4(tint,1.0);\n#include <colorspace_fragment>\n}",
      });
      const stroke = new THREE.Mesh(geometry, material);
      stroke.frustumCulled = false;
      stroke.renderOrder = 11;
      stroke.visible = false;
      stroke.userData.anatomyHighlight = true;
      stroke.userData.screenBorder = true;
      return stroke;
    }
    function writeStroke(stroke, segments, positions, uv) {
      const attrs = stroke.geometry.attributes,
        pattern = [
          [0, -1],
          [1, -1],
          [1, 1],
          [0, -1],
          [1, 1],
          [0, 1],
        ];
      let v = 0;
      for (const [a, b] of segments)
        for (const [end, side] of pattern) {
          const i = end ? b : a,
            j = end ? a : b;
          attrs.position.setXYZ(
            v,
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i),
          );
          attrs.otherEnd.setXYZ(
            v,
            positions.getX(j),
            positions.getY(j),
            positions.getZ(j),
          );
          // Each endpoint points at the other one, so reverse the perpendicular at B.
          attrs.strokeSide.setXY(v, -1, end ? -side : side);
          attrs.uv.setXY(v, uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
          v++;
        }
      for (const attr of Object.values(attrs)) attr.needsUpdate = true;
      stroke.geometry.setDrawRange(0, v);
    }
    function silhouetteTopology(geometry) {
      if (silhouetteCache.has(geometry)) return silhouetteCache.get(geometry);
      const positions = geometry.attributes.position,
        index = geometry.index,
        vertices = new Map(),
        welded = [],
        faces = [],
        edges = new Map();
      for (let i = 0; i < positions.count; i++) {
        const key = [positions.getX(i), positions.getY(i), positions.getZ(i)]
          .map((v) => Math.round(v * 1e5))
          .join(",");
        if (!vertices.has(key)) vertices.set(key, vertices.size);
        welded[i] = vertices.get(key);
      }
      for (let k = 0; k < (index ? index.count : positions.count); k += 3) {
        const ids = [0, 1, 2].map((c) => (index ? index.getX(k + c) : k + c)),
          p = ids.map((i) =>
            new THREE.Vector3().fromBufferAttribute(positions, i),
          );
        const normal = p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0]));
        if (normal.lengthSq() < 1e-18) continue;
        const face = faces.length;
        faces.push({
          normal,
          center: p[0].clone().add(p[1]).add(p[2]).divideScalar(3),
        });
        for (let c = 0; c < 3; c++) {
          const a = ids[c],
            b = ids[(c + 1) % 3],
            wa = welded[a],
            wb = welded[b];
          if (wa === wb) continue;
          const key = Math.min(wa, wb) + "," + Math.max(wa, wb);
          if (!edges.has(key)) edges.set(key, { a, b, faces: [] });
          edges.get(key).faces.push(face);
        }
      }
      const topology = { faces, edges: [...edges.values()] };
      silhouetteCache.set(geometry, topology);
      return topology;
    }
    function updateScreenBorders() {
      scene.updateMatrixWorld(true);
      for (const entry of outlineEntries) {
        const { mesh, stroke, overlay, topology } = entry;
        stroke.visible = overlay.visible;
        if (!stroke.visible) continue;
        stroke.material.uniforms.tint.value =
          overlay.material.uniforms.tint.value;
        const localCamera = mesh.worldToLocal(
          camera.getWorldPosition(new THREE.Vector3()),
        );
        const facing = topology.faces.map(
          (f) => f.normal.dot(localCamera.clone().sub(f.center)) >= 0,
        );
        const segments = topology.edges
          .filter(
            (e) =>
              e.faces.length === 1 ||
              e.faces.some((f) => facing[f] !== facing[e.faces[0]]),
          )
          .map((e) => [e.a, e.b]);
        writeStroke(
          stroke,
          segments,
          mesh.geometry.attributes.position,
          mesh.geometry.attributes.uv,
        );
      }
    }
    function addSurfaceHighlight(sourceName, partIndex, region) {
      const source = sources[sourceName];
      if (!source) return;
      const meshes = [];
      source.traverse((o) => {
        if (o.isMesh && !o.userData.anatomyHighlight) meshes.push(o);
      });
      for (const mesh of meshes) {
        const borderRegion =
          partIndex === 0
            ? "solidBorder=max(screenLine(eyePoint.x+1.0),screenLine(length(eyePoint.yz)-.49));"
            : partIndex === 1
              ? "solidBorder=max(screenLine(r-.017),screenLine(r-.040));"
              : partIndex === 7
                ? sourceName === "Sphere"
                  ? "solidBorder=screenLine(eyePoint.x-1.10);"
                  : "solidBorder=max(screenLine(eyePoint.x+.40),screenLine(length(eyePoint.yz)-.46));"
                : "";
        const uniforms = {
          uSelected: { value: 0 },
          glow: { value: 1 },
          tint: { value: highlightColor },
          borderPixels,
          pixelScale,
        };
        const material = new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          side: partIndex === 7 ? THREE.FrontSide : THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -3,
          polygonOffsetUnits: -3,
          toneMapped: false,
          vertexShader:
            "varying vec3 eyePoint;varying vec2 surfaceUV;varying vec3 viewNormal;varying vec3 viewPosition;void main(){surfaceUV=uv;vec4 world=modelMatrix*vec4(position,1.0);eyePoint=world.xyz;vec4 mv=modelViewMatrix*vec4(position,1.0);viewNormal=normalize(normalMatrix*normal);viewPosition=-mv.xyz;gl_Position=projectionMatrix*mv;}",
          fragmentShader:
            "uniform float uSelected;uniform float glow;uniform vec3 tint;uniform float borderPixels;uniform float pixelScale;varying vec3 eyePoint;varying vec2 surfaceUV;varying vec3 viewNormal;varying vec3 viewPosition;float screenLine(float d){float gradient=max(length(vec2(dFdx(d),dFdy(d))),.00001);return 1.0-smoothstep(borderPixels,borderPixels+.75,abs(d)/gradient/pixelScale);}void main(){if(uSelected<0.5)discard;" +
            region +
            "float facing=abs(dot(normalize(viewNormal),normalize(viewPosition)));float rim=pow(1.0-facing,2.0);float solidBorder=0.0;" +
            borderRegion +
            "float alpha=mix((0.28+0.46*rim)*glow,1.0,solidBorder);gl_FragColor=vec4(tint,alpha);\n#include <colorspace_fragment>\n}",
        });
        material.extensions.derivatives = true;
        const overlay = new THREE.Mesh(mesh.geometry, material);
        overlay.name = "Highlight: " + anatomyParts[partIndex].name;
        overlay.userData.anatomyHighlight = true;
        overlay.visible = false;
        overlay.renderOrder = 10;
        mesh.add(overlay);
        highlightOverlays.push({ overlay, partIndex });
        highlightUniforms.push({ uniforms, partIndex });
        // UV boundaries define the iris; all other selected surfaces also get an
        // actual geometric silhouette, including the lens's exposed cut edges.
        if (partIndex !== 1) {
          const topology = silhouetteTopology(mesh.geometry),
            stroke = screenStroke(topology.edges.length, region);
          stroke.name = "Border: " + anatomyParts[partIndex].name;
          mesh.add(stroke);
          outlineEntries.push({
            mesh,
            stroke,
            overlay,
            topology,
            partIndex,
          });
        }
      }
    }
    addSurfaceHighlight(
      "cornea",
      0,
      "if(eyePoint.x>-1.0||length(eyePoint.yz)>0.49)discard;",
    );
    for (const name of ["eye", "eye.003"])
      addSurfaceHighlight(
        name,
        1,
        "float r=distance(surfaceUV,vec2(251.0/1024.0,763.0/1024.0));if(r<.017||r>.040)discard;",
      );
    addSurfaceHighlight("구체", 3, "");
    addSurfaceHighlight("Sphere.002", 4, "");
    addSurfaceHighlight("glaucoma nerve", 5, "");
    // The optic disc is selected in the retina shader, using its actual UV footprint.
    addSurfaceHighlight("Sphere", 7, "if(eyePoint.x>1.10)discard;");
    for (const name of ["eye", "eye.003"])
      addSurfaceHighlight(
        name,
        7,
        "if(eyePoint.x>-.40||length(eyePoint.yz)<.46)discard;",
      );
    // Follow the source mesh's inner iris lip. This is an open semicircle in the cutaway,
    // not a free-floating complete torus in front of the cornea.
    const rimPoints = [],
      rimKeys = new Set();
    sources["eye.003"].traverse((mesh) => {
      if (!mesh.isMesh || mesh.userData.anatomyHighlight) return;
      const positions = mesh.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const p = mesh.localToWorld(
          new THREE.Vector3().fromBufferAttribute(positions, i),
        );
        const r = Math.hypot(p.y + 0.014, p.z - 0.0824),
          key = p
            .toArray()
            .map((v) => v.toFixed(5))
            .join(",");
        if (
          p.x > -0.92 &&
          p.x < -0.91 &&
          r > 0.119 &&
          r < 0.137 &&
          !rimKeys.has(key)
        ) {
          rimKeys.add(key);
          rimPoints.push(p);
        }
      }
    });
    const rimAngle = (p) =>
      (Math.atan2(p.z - 0.0824, p.y + 0.014) + Math.PI * 2) % (Math.PI * 2);
    rimPoints.sort((a, b) => rimAngle(a) - rimAngle(b));
    if (rimPoints.length < 8)
      throw new Error(
        "The pupil boundary could not be located in the source model.",
      );
    const pupilCurve = new THREE.CatmullRomCurve3(rimPoints).getPoints(96),
      pupilPositions = new THREE.Float32BufferAttribute(
        pupilCurve.flatMap((p) => p.toArray()),
        3,
      );
    const pupilHighlight = screenStroke(96);
    writeStroke(
      pupilHighlight,
      Array.from({ length: 96 }, (_, i) => [i, i + 1]),
      pupilPositions,
    );
    pupilHighlight.renderOrder = 12;
    pupilHighlight.visible = false;
    pupilHighlight.userData.anatomyHighlight = true;
    scene.add(pupilHighlight);
    labelEntries[2].point.copy(rimPoints.reduce((a, b) => (a.z < b.z ? a : b)));
    function updateHighlight() {
      const active = anatomyMode ? selectedPart : -1;
      const cue = !anatomyMode && cueRemaining > 0;
      highlightOverlays.forEach(({ overlay, partIndex }) => {
        overlay.visible = partIndex === active || (cue && partIndex === 5);
      });
      highlightUniforms.forEach(({ uniforms, partIndex }) => {
        uniforms.uSelected.value =
          partIndex === active || (cue && partIndex === 5) ? 1 : 0;
        uniforms.tint.value = cue ? new THREE.Color("#f25600") : highlightColor;
        uniforms.glow.value = 1;
      });
      retinaSelection.value =
        active === 6
          ? 1
          : active === 5 || active === 8 || cue
            ? 2
            : active === 9
              ? 3
              : active === 10
                ? 4
                : 0;
      discCue.value = cue ? 1 : 0;
      pupilHighlight.visible = active === 2;
      $("selection-note").hidden = active < 0;
      $("selection-note").textContent =
        active < 0
          ? ""
          : active === 10
            ? "Cup and disc boundaries shown in cyan; the thicker I marker highlights the gap between them. Drag to inspect."
            : anatomyParts[active].name +
              " highlighted in cyan. Drag to inspect.";
    }

    function selectPart(index) {
      if (!Number.isInteger(index) || index < 0 || index >= anatomyParts.length)
        return;
      cancelCue();
      selectedPart = index;
      if (!anatomyMode) {
        anatomyMode = true;
        setPlaying(false);
        $("anatomy-card").hidden = false;
        $("mode-hint").textContent = "Explore the labels, then start.";
        updateModeControls();
      }
      labelsEnabled = true;
      $("show-labels").checked = true;
      const part = anatomyParts[index];
      $("anatomy-title").textContent = part.name;
      $("anatomy-description").textContent = part.description;
      $("disc-details").hidden = ![5, 6, 8, 9, 10].includes(index);
      $("ratio-formula").hidden = index !== 10;
      if (mobile()) setInfoOpen(true);
      labelEntries.forEach((entry, i) => {
        entry.button.classList.toggle("selected", i === index);
        entry.indexButton.classList.toggle("selected", i === index);
      });
      $("next-part").textContent =
        index === anatomyParts.length - 1 ? "Overview ↺" : "Next part →";
      $("stage").textContent = "ANATOMY";
      $("play").textContent = "Start progression";
      updateHighlight();
      labelEntries.forEach((entry, i) => {
        entry.button.setAttribute("aria-pressed", String(i === index));
        entry.indexButton.setAttribute("aria-pressed", String(i === index));
      });
    }
    function updateModeControls() {
      document.body.dataset.mode = anatomyMode ? "anatomy" : "progression";
      $("progress").disabled = anatomyMode;
      stageButtons.forEach((button) => (button.disabled = anatomyMode));
      applyProgress(progress);
    }
    function showAnatomy() {
      cancelCue();
      anatomyMode = true;
      selectedPart = -1;
      labelsEnabled = true;
      direction = 1;
      dwell = 0;
      $("anatomy-card").hidden = false;
      $("show-labels").checked = true;
      $("anatomy-title").textContent = "Explore the eye";
      $("anatomy-description").textContent = overview;
      $("disc-details").hidden = true;
      setInfoOpen(false);
      $("next-part").textContent = "Next part →";
      labelEntries.forEach((entry) => {
        entry.button.classList.remove("selected");
        entry.indexButton.classList.remove("selected");
      });
      updateHighlight();
      labelEntries.forEach((entry) => {
        entry.button.setAttribute("aria-pressed", "false");
        entry.indexButton.setAttribute("aria-pressed", "false");
      });
      setPlaying(false);
      applyProgress(0);
      updateModeControls();
      resetView();
      $("mode-hint").textContent = "Explore the labels, then start.";
      $("mode-hint").classList.add("intro-status");
    }
    function leaveAnatomy() {
      anatomyMode = false;
      updateHighlight();
      $("anatomy-card").hidden = true;
      labelsEnabled = false;
      $("show-labels").checked = false;
      $("mode-hint").textContent = "Rotate and zoom during playback.";
      $("mode-hint").classList.remove("intro-status");
      updateModeControls();
    }
    function cancelCue() {
      cueRemaining = 0;
      cueHold = 0;
      $("attention").hidden = true;
      updateHighlight();
    }
    function startProgression() {
      leaveAnatomy();
      direction = 1;
      dwell = 0;
      if (progress >= 1) applyProgress(0);
      cueRemaining = 4.2;
      cueHold = 1.6;
      updateHighlight();
      setPlaying(true);
    }
    function focusNerve() {
      autoFit = false;
      const point = discPoint
        .clone()
        .lerp(new THREE.Vector3(2.45, 0.05, 0.08), 0.35);
      controls.target.copy(point);
      camera.position
        .copy(
          new THREE.Vector3(-3.5, 1.5, 4.4)
            .normalize()
            .multiplyScalar(mobile() ? 5.3 : 3.8),
        )
        .add(point);
      controls.update();
      if (anatomyMode) selectPart(5);
    }
    let labelLayout = [],
      mobileLeaderVisible = false,
      mobileLeaders = [],
      mobileLeaderTrunk = [];
    function setLeaderVisible(visible) {
      mobileLeaderVisible = visible;
      const svg = $("mobile-leader");
      if (visible) svg.removeAttribute("hidden");
      else svg.setAttribute("hidden", "");
    }
    function updateAttention(now) {
      const visible = !anatomyMode && cueRemaining > 0;
      $("attention").hidden = !visible;
      if (!visible) return;
      const w = container.clientWidth,
        h = container.clientHeight,
        card = $("attention-card"),
        cardRect = card.getBoundingClientRect(),
        viewportRect = container.getBoundingClientRect();
      const cardLeft = cardRect.left - viewportRect.left,
        cardRight = cardRect.right - viewportRect.left,
        cardBottom = cardRect.bottom - viewportRect.top;
      camera.updateMatrixWorld();
      for (const [id, point, radius] of [
        ["nerve", new THREE.Vector3(2.45, 0.05, 0.08), 15],
        ["disc", cupPoint, 16],
      ]) {
        const p = point.clone().project(camera),
          x = (p.x * 0.5 + 0.5) * w,
          y = (-p.y * 0.5 + 0.5) * h,
          valid = p.z > -1 && p.z < 1 && x > 0 && x < w && y > 0 && y < h;
        const line = $("cue-" + id),
          shadow = $("cue-" + id + "-shadow"),
          ring = $("cue-" + id + "-ring");
        line.style.display =
          shadow.style.display =
          ring.style.display =
            valid ? "" : "none";
        if (valid) {
          const startX =
              x < cardLeft
                ? cardLeft - 2
                : x > cardRight
                  ? cardRight + 2
                  : cardLeft + cardRect.width * (id === "disc" ? 0.28 : 0.72),
            startY =
              x < cardLeft || x > cardRight ? cardBottom - 18 : cardBottom + 3;
          const dx = x - startX,
            dy = y - startY,
            len = Math.max(1, Math.hypot(dx, dy)),
            endX = x - (dx / len) * (radius + 5),
            endY = y - (dy / len) * (radius + 5),
            elbowX = startX + (endX - startX) / 3;
          const path = `M ${startX} ${startY} L ${elbowX} ${startY} L ${endX} ${endY}`;
          line.setAttribute("d", path);
          shadow.setAttribute("d", path);
          ring.setAttribute("cx", x);
          ring.setAttribute("cy", y);
          ring.setAttribute("r", radius);
        }
      }
      const pulse = 0.78 + 0.22 * Math.sin(now * 0.006);
      highlightUniforms
        .filter((h) => h.partIndex === 5)
        .forEach((h) => (h.uniforms.glow.value = pulse));
    }
    function updateMobileLeader() {
      const svg = $("mobile-leader"),
        trunk = $("mobile-leader-trunk"),
        visible = mobile() && labelsEnabled && anatomyMode && selectedPart >= 0;
      mobileLeaders = [];
      mobileLeaderTrunk = [];
      trunk.style.display = "none";
      setLeaderVisible(false);
      if (!visible) return;
      const entry = labelEntries[selectedPart],
        rect = container.getBoundingClientRect(),
        wrap = container.parentElement.getBoundingClientRect(),
        button = entry.button.getBoundingClientRect();
      const targets = [
        {
          point: entry.point,
          suffix: "",
          target:
            selectedPart === 5
              ? "nerve bundle"
              : anatomyParts[selectedPart].name,
        },
      ];
      if (selectedPart === 5)
        targets.push({
          point: cupPoint,
          suffix: "-cup",
          target: "retinal cup",
        });
      for (const suffix of ["", "-cup"]) {
        $("mobile-leader-line" + suffix).style.display = $(
          "mobile-leader-dot" + suffix,
        ).style.display = "none";
      }
      camera.updateMatrixWorld();
      svg.setAttribute("viewBox", `0 0 ${wrap.width} ${wrap.height}`);
      const projected = targets
        .map((target) => {
          const p = target.point.clone().project(camera),
            x = rect.left - wrap.left + (p.x * 0.5 + 0.5) * rect.width,
            y = rect.top - wrap.top + (-p.y * 0.5 + 0.5) * rect.height;
          return {
            ...target,
            x,
            y,
            valid:
              p.z > -1 &&
              p.z < 1 &&
              x >= 0 &&
              x <= wrap.width &&
              y >= 0 &&
              y <= rect.height,
          };
        })
        .filter((t) => t.valid);
      const pathString = (points) =>
        points
          .map(
            (v, i) => (i ? "L" : "M") + v[0].toFixed(2) + " " + v[1].toFixed(2),
          )
          .join(" ");
      let junction = null;
      if (projected.length === 2) {
        // One shared stem, drawn once, then two separate branches at its midpoint.
        const averageX = (projected[0].x + projected[1].x) / 2,
          averageY = (projected[0].y + projected[1].y) / 2,
          leftSide = averageX < button.left - wrap.left + button.width / 2;
        const sx = Math.max(
            1,
            Math.min(
              wrap.width - 1,
              (leftSide ? button.left : button.right) -
                wrap.left +
                (leftSide ? -2.5 : 2.5),
            ),
          ),
          sy = button.top - wrap.top + button.height / 2;
        junction = [sx, (sy + averageY) / 2];
        mobileLeaderTrunk = [[sx, sy], junction];
        trunk.style.display = "";
        trunk.setAttribute("d", pathString(mobileLeaderTrunk));
      }
      for (const target of projected) {
        const { x, y } = target,
          line = $("mobile-leader-line" + target.suffix),
          dot = $("mobile-leader-dot" + target.suffix);
        line.style.display = dot.style.display = "";
        // Leave from the button edge into the grid gutter, then bend only once,
        // one third of the distance from the MODEL back toward the label.
        const leftSide = x < button.left - wrap.left + button.width / 2,
          startX = Math.max(
            1,
            Math.min(
              wrap.width - 1,
              (leftSide ? button.left : button.right) -
                wrap.left +
                (leftSide ? -2.5 : 2.5),
            ),
          ),
          startY = button.top - wrap.top + button.height / 2;
        const points = junction
          ? [junction, [x, y]]
          : [
              [startX, startY],
              [startX, y + (startY - y) / 3],
              [x, y],
            ];
        line.setAttribute("d", pathString(points));
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        dot.setAttribute("r", "4.5");
        mobileLeaders.push({
          target: target.target,
          points,
          sharedTrunk: !!junction,
        });
      }
      setLeaderVisible(mobileLeaders.length > 0);
    }
    function updateLabels() {
      $("labels-layer").hidden = !labelsEnabled;
      const retinalLeader = labelEntries[5].retinalLeader;
      retinalLeader.line.style.display = retinalLeader.dot.style.display =
        "none";
      setLeaderVisible(false);
      mobileLeaders = [];
      mobileLeaderTrunk = [];
      if (!labelsEnabled) {
        labelLayout = [];
        return;
      }
      if (mobile()) {
        labelEntries.forEach((entry) => {
          entry.button.style.left = "";
          entry.button.style.top = "";
          entry.line.style.display = "none";
          entry.dot.style.display = "none";
        });
        labelLayout = labelEntries.map((entry, i) => ({
          name: anatomyParts[i].name,
          side: "dock",
          visible: true,
          overlapsModel: false,
          leaderVisible: i === selectedPart,
        }));
        updateMobileLeader();
        return;
      }
      const w = container.clientWidth,
        h = container.clientHeight,
        labelWidth = innerWidth <= 1080 ? 108 : 122,
        gap = 48,
        top = 78,
        bottom = h - 35;
      camera.updateMatrixWorld();
      const projectTarget = (point, leader, target) => {
        const p = point.clone().project(camera),
          x = (p.x * 0.5 + 0.5) * w,
          y = (-p.y * 0.5 + 0.5) * h;
        return {
          ...leader,
          target,
          x,
          y,
          valid:
            p.z > -1 && p.z < 1 && x > 8 && x < w - 8 && y > 8 && y < h - 12,
        };
      };
      const layout = labelEntries.map((entry, i) => {
        const primary = projectTarget(
            entry.point,
            entry,
            i === 5 ? "nerve bundle" : anatomyParts[i].name,
          ),
          { x, y } = primary,
          targets = [primary];
        if (entry.retinalLeader)
          targets.push(
            projectTarget(cupPoint, entry.retinalLeader, "retinal cup"),
          );
        const side = anatomyParts[i].side,
          valid = targets.some((t) => t.valid);
        return {
          entry,
          index: i,
          name: anatomyParts[i].name,
          x,
          y,
          side,
          valid,
          targets,
          labelY: Math.max(top, Math.min(bottom, y)),
          segments: [],
          leaders: [],
          sharedStem: [],
        };
      });
      for (const side of ["left", "right"]) {
        const group = layout
          .filter((item) => item.side === side)
          .sort((a, b) => a.y - b.y || a.index - b.index);
        const spacing = Math.min(
          gap,
          (bottom - top) / Math.max(1, group.length - 1),
        );
        // Preserve the projected top-to-bottom order, then spread only enough to avoid overlap.
        for (let i = 1; i < group.length; i++)
          group[i].labelY = Math.max(
            group[i].labelY,
            group[i - 1].labelY + spacing,
          );
        if (group.length && group.at(-1).labelY > bottom) {
          group.at(-1).labelY = bottom;
          for (let i = group.length - 2; i >= 0; i--)
            group[i].labelY = Math.min(
              group[i].labelY,
              group[i + 1].labelY - spacing,
            );
        }
        const edge = side === "left" ? 6 + labelWidth : w - labelWidth - 6;
        const rail = edge + (side === "left" ? 12 : -12);
        const valid = group.flatMap((item) =>
          item.targets.filter((t) => t.valid),
        );
        // A shared routing gate keeps the diagonal fan outside all horizontal endpoint branches.
        const gate =
          side === "left"
            ? Math.max(
                rail + 2,
                Math.min(w / 2 - 8, ...valid.map((item) => item.x - 18)),
              )
            : Math.min(
                rail - 2,
                Math.max(w / 2 + 8, ...valid.map((item) => item.x + 18)),
              );
        for (const item of group) {
          const { entry, index, labelY } = item,
            lx = side === "left" ? 6 : w - labelWidth - 6,
            selected = selectedPart === index;
          entry.button.style.left = lx + "px";
          entry.button.style.top = labelY + "px";
          // Split halfway from the label to the midpoint of the two model anchors.
          const targets = item.targets.filter((t) => t.valid),
            junction =
              targets.length === 2
                ? [
                    (edge + (targets[0].x + targets[1].x) / 2) / 2,
                    (labelY + (targets[0].y + targets[1].y) / 2) / 2,
                  ]
                : null;
          if (junction)
            item.sharedStem = [[edge, labelY], [rail, labelY], junction];
          for (const target of item.targets) {
            const { line, dot, x, y } = target;
            line.style.display = dot.style.display = target.valid ? "" : "none";
            if (!target.valid) continue;
            // Draw the shared stem once; the second branch starts at its junction.
            const points = junction
              ? target === targets[0]
                ? [...item.sharedStem, [x, y]]
                : [junction, [x, y]]
              : [
                  [edge, labelY],
                  [rail, labelY],
                  [gate, y],
                  [x, y],
                ];
            line.setAttribute(
              "d",
              points
                .map(
                  (p, i) =>
                    (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2),
                )
                .join(" "),
            );
            line.setAttribute("stroke", selected ? "#60e8ef" : "#f2560080");
            line.setAttribute("stroke-width", selected ? "2" : "1");
            dot.setAttribute("cx", x);
            dot.setAttribute("cy", y);
            dot.setAttribute("r", selected ? "4" : "2.3");
            dot.setAttribute("fill", selected ? "#60e8ef" : "#f25600");
            item.segments.push(
              ...points.slice(1).map((p, i) => [points[i], p]),
            );
            item.leaders.push({ target: target.target, points });
          }
        }
      }
      labelLayout = layout.map(
        ({
          name,
          side,
          labelY,
          x,
          y,
          valid,
          segments,
          leaders,
          sharedStem,
        }) => ({
          name,
          side,
          labelY,
          anchor: [x, y],
          visible: valid,
          segments,
          leaders,
          sharedStem,
        }),
      );
    }

    $("anatomy").onclick = showAnatomy;
    $("begin").onclick = startProgression;
    $("focus-nerve").onclick = focusNerve;
    $("show-labels").onchange = () => {
      labelsEnabled = $("show-labels").checked;
      $("labels-layer").hidden = !labelsEnabled;
      if (autoFit) fitModel();
    };
    $("next-part").onclick = () => {
      if (selectedPart === anatomyParts.length - 1) showAnatomy();
      else selectPart(selectedPart + 1);
    };
    for (const button of document.querySelectorAll("[data-reference]"))
      button.onclick = () => {
        cancelCue();
        applyProgress(Number(button.dataset.reference));
      };
    function setInfoOpen(open) {
      $("anatomy-details").classList.toggle("open", open);
      $("details-toggle").setAttribute("aria-expanded", String(open));
      $("details-toggle").textContent = open ? "Close ▴" : "Open ▾";
    }
    function disclosure(buttonId, targetId) {
      const button = $(buttonId),
        target = $(targetId);
      button.onclick = () => {
        const open = target.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      };
    }
    disclosure("more-tools", "view-tools");
    $("details-toggle").onclick = () =>
      setInfoOpen(!$("anatomy-details").classList.contains("open"));
    disclosure("settings-toggle", "playback-settings");
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setInfoOpen(false);
        for (const [button, target] of [
          ["more-tools", "view-tools"],
          ["settings-toggle", "playback-settings"],
        ]) {
          $(target).classList.remove("open");
          $(button).setAttribute("aria-expanded", "false");
        }
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (
        !$("view-tools").contains(e.target) &&
        !$("more-tools").contains(e.target)
      ) {
        $("view-tools").classList.remove("open");
        $("more-tools").setAttribute("aria-expanded", "false");
      }
    });

    for (const element of document.querySelectorAll("button,input,select"))
      element.disabled = false;
    $("loading").hidden = true;
    $("loading").style.display = "none";
    ready = true;
    showAnatomy();
    window.eyeViewer = {
      ready: true,
      showAnatomy,
      startProgression,
      selectPart,
      focusNerve,
      setProgress: (value) => {
        cancelCue();
        applyProgress(value);
      },
      pause: () => setPlaying(false),
      play: () => (anatomyMode ? startProgression() : setPlaying(true)),
      resetView,
      state: () => ({
        anatomyMode,
        selectedPart,
        labelsEnabled,
        highlightedPart:
          anatomyMode && selectedPart >= 0
            ? anatomyParts[selectedPart].name
            : null,
        highlightSurfaces:
          highlightOverlays.filter((h) => h.overlay.visible).length +
          (pupilHighlight.visible ? 1 : 0) +
          (retinaSelection.value > 0 ? 1 : 0),
        labelLayout,
        mobileLeaderVisible,
        mobileLeaders,
        mobileLeaderTrunk,
        rimRadius: morph.disc.radius * rimOuterScale.value,
        nerveColorMode: "original-gold-unlit",
        ratioMarker: {
          ...ratioMarker,
          visible: anatomyMode && selectedPart === 10,
        },
        infoOpen: $("anatomy-details").classList.contains("open"),
        nerveShadingMeshes,
        discAlignment: {
          center: morph.disc.center,
          contourSamples: morph.disc.contour.length,
        },
        retinaMaterial: "cup-contour-morph",
        cupMorph: {
          segment: cupStage.value,
          shapeProgress: cupBlend.value,
          appearanceProgress: cupAppearance.value,
        },
        retinaSelection: retinaSelection.value,
        discHighlighted:
          retinaSelection.value === 1 || retinaSelection.value === 4,
        cupHighlighted:
          retinaSelection.value === 2 || retinaSelection.value === 4,
        rimHighlighted: retinaSelection.value === 3,
        discBorderFixed: true,
        discPoint: discPoint.toArray(),
        cupPoint: cupPoint.toArray(),
        pupilBoundaryPoints: rimPoints.length,
        pupilBounds: new THREE.Box3().setFromPoints(rimPoints),
        cueRemaining,
        progress,
        playing,
        direction,
        nerveScale: nerve.scale.toArray(),
        camera: camera.position.toArray(),
        target: controls.target.toArray(),
        modelBounds: screenBounds(),
        textureProgress: progression.value,
        meshCount: (() => {
          let n = 0;
          model.traverse((o) => {
            if (o.isMesh && !o.userData.anatomyHighlight) n++;
          });
          return n;
        })(),
      }),
    };
    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (ready && playing && !document.hidden) {
        if (cueRemaining > 0) {
          cueRemaining = Math.max(0, cueRemaining - dt);
          if (cueRemaining === 0) updateHighlight();
        }
        if (cueHold > 0) cueHold = Math.max(0, cueHold - dt);
        else if (dwell > 0) dwell = Math.max(0, dwell - dt);
        else {
          const next = progress + (direction * dt * speed) / duration;
          if (next >= 1 || next <= 0) {
            applyProgress(Math.max(0, Math.min(1, next)));
            if ($("loop").checked) {
              direction *= -1;
              dwell = 1.2;
            } else setPlaying(false);
          } else applyProgress(next);
        }
      }
      controls.update();
      updateScreenBorders();
      updateLabels();
      updateAttention(now);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  } catch (error) {
    console.error(error);
    $("loading").innerHTML =
      "<strong>The 3D model could not be displayed.</strong><span>Please open this file in Chrome or Edge.</span>";
    $("error").textContent = error.message;
    window.eyeViewer = { ready: false, error: error.message };
  }
})();
