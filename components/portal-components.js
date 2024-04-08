// This component hides and shows certain elements as the camera moves
const portalCameraComponent = {
  schema: {
    width: { default: 10 },
    height: { default: 10 },
  },
  init() {
    this.camera = this.el;
    this.contents = document.getElementById("portal-contents");
    this.walls = document.getElementById("hider-walls");
    this.portalWall = document.getElementById("portal-wall");
    this.portalVideo = document.getElementById("portalVideo");
    this.isInPortalSpace = false;
    this.wasOutside = true;
  },

  tick() {
    const { position } = this.camera.object3D;
    const isOutside = position.z > 0;
    const withinPortalBounds =
      position.y < this.data.height &&
      Math.abs(position.x) < this.data.width / 2;
    if (this.wasOutside !== isOutside && withinPortalBounds) {
      this.isInPortalSpace = !isOutside;
    }
    this.contents.object3D.visible = this.isInPortalSpace || isOutside;
    this.walls.object3D.visible = !this.isInPortalSpace && isOutside;
    this.portalWall.object3D.visible = this.isInPortalSpace && !isOutside;
    this.portalVideo.object3D.visible = isOutside;
    this.wasOutside = isOutside;
  },
};

const tapToPlacePortalComponent = {
  init() {
    const { sceneEl } = this.el;
    const recenterBtn = document.getElementById("recenterButton");

    this.camera = document.getElementById("camera");
    this.contents = document.getElementById("portal-contents");
    this.walls = document.getElementById("hider-walls");
    this.portalWall = document.getElementById("portal-wall");
    this.isInPortalSpace = false;
    this.wasOutside = true;

    const portalHiderRing = this.el.sceneEl.querySelector("#portalHiderRing");
    const portalRim = this.el.sceneEl.querySelector("#portalRim");
    const portalVideo = this.el.sceneEl.querySelector("#portalVideo");
    const portalShadow = this.el.sceneEl.querySelector("#portalShadow");

    const handleClickEvent = (e) => {
      if (!e.touches || e.touches.length < 2) {
        recenterBtn.classList.add("pulse-once");
        sceneEl.emit("recenter");
        setTimeout(() => {
          recenterBtn.classList.remove("pulse-once");
        }, 200);
      }
    };

    const firstPlaceEvent = (e) => {
      sceneEl.emit("recenter");
      sceneEl.emit("dismissPrompt");

      portalHiderRing.setAttribute("animation__1", {
        property: "radius-inner",
        dur: 1500,
        from: "0.001",
        to: "3.5",
        easing: "easeOutElastic",
      });

      portalRim.setAttribute("animation__2", {
        property: "scale",
        dur: 1500,
        from: "0.001 0.001 0.001",
        to: "4.3 4.3 4.3",
        easing: "easeOutElastic",
      });

      portalVideo.setAttribute("animation__3", {
        property: "scale",
        dur: 1500,
        from: "0.001 0.001 0.001",
        to: "7 7 1",
        easing: "easeOutElastic",
      });

      portalShadow.setAttribute("animation__4", {
        property: "scale",
        dur: 1500,
        from: "0.001 0.001 0.001",
        to: "15.5 2 11",
        easing: "easeOutElastic",
      });
      sceneEl.removeEventListener("click", firstPlaceEvent);
      recenterBtn.addEventListener("click", handleClickEvent, true);
    };

    sceneEl.addEventListener("click", firstPlaceEvent);
  },
};

const promptFlowComponent = {
  init() {
    this.prompt = document.getElementById("promptText");
    this.overlay = document.getElementById("overlay");

    this.el.sceneEl.addEventListener("realityready", () => {
      this.overlay.style.display = "block";
      this.prompt.innerHTML = "Tap to Place<br>Moon Portal";
      this.prompt.classList.add("fly-in");
    });

    this.el.addEventListener("dismissPrompt", () => {
      this.prompt.classList.remove("fly-in");
      this.prompt.classList.add("fly-out");
    });
  },
};

const spinComponent = {
  schema: {
    speed: { default: 2000 },
    direction: { default: "normal" },
    axis: { default: "y" },
  },
  init() {
    const { el } = this;
    el.setAttribute("animation__spin", {
      property: `object3D.rotation.${this.data.axis}`,
      from: 0,
      to: 360,
      dur: this.data.speed,
      dir: this.data.direction,
      loop: true,
      easing: "linear",
    });
  },
};

export {
  portalCameraComponent,
  tapToPlacePortalComponent,
  promptFlowComponent,
  spinComponent,
};
