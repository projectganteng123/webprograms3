/**
 * ui.js — Render UI dan handle interaksi pengguna.
 * Baca data dari Store, tulis balik lewat Store API.
 * Tidak ada state lokal di sini.
 */

// ─── Gambar marker untuk download ────────────────────────────
const MARKER_IMAGES = {
  hiro:    'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/hiro.png',
  kanji:   'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/kanji.png',
  letterA: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterA.png',
  letterB: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterB.png',
  letterC: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterC.png',
  letterD: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterD.png',
};

const MARKER_LABELS = {
  hiro: 'Hiro', kanji: 'Kanji',
  letterA: 'Letter A', letterB: 'Letter B',
  letterC: 'Letter C', letterD: 'Letter D',
};

// ─── Panel ────────────────────────────────────────────────────
function openPanel()  {
  document.getElementById('settings-panel').classList.add('open');
  document.getElementById('panel-backdrop').classList.add('open');
}
function closePanel() {
  document.getElementById('settings-panel').classList.remove('open');
  document.getElementById('panel-backdrop').classList.remove('open');
}

// ─── Render daftar marker ─────────────────────────────────────
function renderMarkerList() {
  const list    = document.getElementById('marker-list');
  const markers = Store.getMarkers();

  if (markers.length === 0) {
    list.innerHTML = '<p class="empty-hint">Belum ada marker ditambahkan</p>';
    return;
  }

  list.innerHTML = markers.map(m => `
    <div class="marker-item">
      <div class="marker-info">
        <span class="marker-name">${_esc(m.name)}</span>
        <span class="marker-type">${MARKER_LABELS[m.type] || m.type}</span>
      </div>
      <div class="marker-actions">
        <button class="btn-icon" onclick="UI.openDownloadModal('${m.type}','${_esc(m.name)}')" title="Download marker">
          <i class="ti ti-download" aria-hidden="true"></i>
        </button>
        <button class="btn-icon danger" onclick="UI.removeMarker(${m.id})" title="Hapus marker">
          <i class="ti ti-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function _esc(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ─── Tambah Marker ────────────────────────────────────────────
function openAddModal() {
  document.getElementById('modal-add').classList.add('open');
  document.getElementById('input-name').focus();
}

function closeAddModal() {
  document.getElementById('modal-add').classList.remove('open');
  document.getElementById('input-name').value = '';
}

function addMarker() {
  const name = document.getElementById('input-name').value.trim();
  const type = document.getElementById('input-type').value;
  if (!name) {
    document.getElementById('input-name').focus();
    return;
  }
  Store.addMarker(name, type);
  closeAddModal();
}

function removeMarker(id) {
  Store.removeMarker(id);
}

// ─── Download Marker ──────────────────────────────────────────
function openDownloadModal(type, name) {
  const imgSrc = MARKER_IMAGES[type];
  if (!imgSrc) return;

  document.getElementById('dl-title').textContent = name;
  document.getElementById('dl-img').src = imgSrc;

  const link = document.getElementById('dl-link');
  link.href     = imgSrc;
  link.download = `marker-${type}.png`;

  document.getElementById('modal-download').classList.add('open');
}

function closeDownloadModal() {
  document.getElementById('modal-download').classList.remove('open');
}

// ─── Kontrol Slider ───────────────────────────────────────────
function initSliders() {
  const controls = Store.getControls();

  const sliders = [
    { id: 'ctrl-scale',  valId: 'val-scale',  key: 'scale',  fmt: v => parseFloat(v).toFixed(1) },
    { id: 'ctrl-height', valId: 'val-height', key: 'height', fmt: v => parseFloat(v).toFixed(2) },
    { id: 'ctrl-rotate', valId: 'val-rotate', key: 'rotate', fmt: v => parseInt(v) + '°' },
  ];

  sliders.forEach(({ id, valId, key, fmt }) => {
    const input = document.getElementById(id);
    const label = document.getElementById(valId);
    if (!input || !label) return;

    // Set nilai awal dari store
    input.value   = controls[key];
    label.textContent = fmt(controls[key]);

    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      label.textContent = fmt(val);
      Store.setControl(key, val);
    });
  });
}

// ─── Upload Model ─────────────────────────────────────────────
function initModelUpload() {
  const input = document.getElementById('model-file-input');
  if (!input) return;

  // Tampilkan nama file yang tersimpan di store (dari sesi sebelumnya)
  const savedName = Store.getModelFileName();
  if (savedName) {
    document.getElementById('model-filename').textContent = savedName + ' (reload diperlukan untuk AR)';
  }

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    Store.setModelFile(file);
    document.getElementById('model-filename').textContent = '✓ ' + file.name;
  });
}

// ─── Render ulang saat Store berubah ─────────────────────────
function initStoreListener() {
  Store.onChange((changed) => {
    if (changed === 'markers') renderMarkerList();
    if (changed === 'controls') {} // slider sudah update sendiri via input event
  });
}

// ─── Init utama ───────────────────────────────────────────────
function init() {
  initSliders();
  initModelUpload();
  renderMarkerList();
  initStoreListener();

  // Keyboard: Enter di input nama marker = submit
  const nameInput = document.getElementById('input-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') addMarker(); });
  }
}

// ─── Export ───────────────────────────────────────────────────
window.UI = {
  init,
  openPanel,
  closePanel,
  openAddModal,
  closeAddModal,
  addMarker,
  removeMarker,
  openDownloadModal,
  closeDownloadModal,
};
