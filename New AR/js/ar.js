/**
 * ar.js — Kirim state ke iframe ar-scene.html via postMessage.
 * Model dikirim sebagai base64 data URL agar bisa diakses iframe.
 */

const AR = (() => {

  function getFrame() {
    return document.getElementById('ar-frame');
  }

  function rebuild() {
    const frame = getFrame();
    if (!frame || !frame.contentWindow) return;

    frame.contentWindow.postMessage({
      type: 'REBUILD',
      payload: {
        markers:   Store.getMarkers(),
        controls:  Store.getControls(),
        modelSrc:  Store.getModelDataURL(),   // base64 data URL, aman lintas iframe
        modelType: Store.getModelFileType(),
      }
    }, '*');

    updateStatus();
  }

  function updateStatus() {
    const el = document.getElementById('status-bar');
    if (!el) return;
    const hasModel   = !!Store.getModelDataURL();
    const numMarkers = Store.getMarkers().length;

    if (!hasModel) {
      el.textContent = 'Upload model 3D di menu Pengaturan';
    } else if (numMarkers === 0) {
      el.textContent = 'Tambah marker di menu Pengaturan';
    } else {
      el.textContent = `${numMarkers} marker aktif — arahkan kamera ke marker`;
    }
  }

  function init() {
    const frame = getFrame();
    if (frame) {
      frame.addEventListener('load', () => {
        // Tunggu A-Frame di iframe siap (~2 detik)
        setTimeout(rebuild, 2000);
      });
    }

    Store.onChange((changed) => {
      if (['markers', 'controls', 'model'].includes(changed)) {
        rebuild();
      }
    });
  }

  return { init, rebuild, updateStatus };
})();

window.AR = AR;
