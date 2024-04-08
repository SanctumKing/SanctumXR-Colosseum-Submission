// This component is an example of how to separate behavior by device category
// using 8th Wall Engine sessionAttributes

const responsiveImmersiveComponent = {
  init() {
    const onAttach = ({ sessionAttributes }) => {
      const hiderWalls = document.getElementById("hider-walls");
      const scene = this.el;
      const s = sessionAttributes;
      if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        !s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        !s.usesWebXr
      ) {
        // Desktop-specific behavior goes here
      } else if (
        s.cameraLinkedToViewer &&
        s.controlsCamera &&
        !s.fillsCameraTexture &&
        s.supportsHtmlEmbedded &&
        !s.supportsHtmlOverlay &&
        !s.usesMediaDevices &&
        s.usesWebXr
      ) {
        // HMD-specific behavior goes here
        if (this.el.sceneEl.xrSession.environmentBlendMode === "opaque") {
          // VR HMD (i.e. Oculus Quest) behavior goes here
        } else if (
          this.el.sceneEl.xrSession.environmentBlendMode === "additive" ||
          "alpha-blend"
        ) {
          // AR HMD (i.e. Quest 3, Hololens) behavior goes here
          scene.setAttribute("tap-to-place-portal", "");
          scene.setAttribute("prompt-flow", "");
          scene.sceneEl.camera.el.setAttribute("portal-camera", "");
        }
      } else if (
        !s.cameraLinkedToViewer &&
        !s.controlsCamera &&
        s.fillsCameraTexture &&
        !s.supportsHtmlEmbedded &&
        s.supportsHtmlOverlay &&
        s.usesMediaDevices &&
        !s.usesWebXr
      ) {
        // Mobile-specific behavior goes here
        scene.setAttribute("tap-to-place-portal", "");
        scene.setAttribute("prompt-flow", "");
        scene.sceneEl.camera.el.setAttribute("portal-camera", "");
      }
    };

    const onxrloaded = () => {
      XR8.addCameraPipelineModules([{ name: "responsiveImmersive", onAttach }]);
    };
    window.XR8 ? onxrloaded() : window.addEventListener("xrloaded", onxrloaded);
  },
};

export { responsiveImmersiveComponent };
