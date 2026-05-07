/**
 * ui.js — Render UI dan handle interaksi pengguna.
 */

const MARKER_IMAGES = {
  hiro:    'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/hiro.png',
  kanji:   'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/kanji.png',
  letterA: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterA.png',
  letterB: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterB.png',
  letterC: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterC.png',
  letterD: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/images/letterD.png',
};

const MARKER_LABELS = {
  hiro:'Hiro', kanji:'Kanji',
  letterA:'Letter A', letterB:'Letter B', letterC:'Letter C', letterD:'Letter D',
};

function openPanel() {
  document.getElementById('settings-panel').classList.add('open');
  document.getElementById('panel-backdrop').classList.add('open');
}
function closePanel() {
  document.getElementById('settings-panel').classList.remove('open');
  document.getElementById('panel-backdrop').classList.remove('open');
}

function renderMarkerList() {
  const list    = document.getElementById('marker-list');
  const markers = Store.getMarkers();
  if (markers.length === 0) {
    list.innerHTML = '<p class="empty-hint">Belum ada marker</p>';
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
          <i class="ti ti-download"></i>
        </button>
        <button class="btn-icon danger" onclick="UI.removeMarker(${m.id})" title="Hapus">
          <i class="ti ti-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function openAddModal() {
  document.getElementById('modal-add').classList.add('open');
  setTimeout(() => document.getElementById('input-name').focus(), 100);
}
function closeAddModal() {
  document.getElementById('modal-add').classList.remove('open');
  document.getElementById('input-name').value = '';
}

function addMarker() {
  const name = document.getElementById('input-name').value.trim();
  const type = document.getElementById('input-type').value;
  if (!name) { document.getElementById('input-name').focus(); return; }
  Store.addMarker(name, type);
  closeAddModal();
}

function removeMarker(id) { Store.removeMarker(id); }

function openDownloadModal(type, name) {
  const imgSrc = MARKER_IMAGES[type];
  if (!imgSrc) return;
  document.getElementById('dl-title').textContent = name;
  document.getElementById('dl-img').src = imgSrc;
  const link = document.getElementById('dl-link');
  link.href = imgSrc;
  link.download = `marker-${type}.png`;
  document.getElementById('modal-download').classList.add('open');
}
function closeDownloadModal() {
  document.getElementById('modal-download').classList.remove('open');
}

function initSliders() {
  const controls = Store.getControls();
  const cfg = [
    { id:'ctrl-scale',  val:'val-scale',  key:'scale',  fmt: v => parseFloat(v).toFixed(1) },
    { id:'ctrl-height', val:'val-height', key:'height', fmt: v => parseFloat(v).toFixed(2) },
    { id:'ctrl-rotate', val:'val-rotate', key:'rotate', fmt: v => parseInt(v)+'°' },
  ];
  cfg.forEach(({ id, val, key, fmt }) => {
    const input = document.getElementById(id);
    const label = document.getElementById(val);
    if (!input || !label) return;
    input.value = controls[key];
    label.textContent = fmt(controls[key]);
    input.addEventListener('input', () => {
      label.textContent = fmt(input.value);
      Store.setControl(key, parseFloat(input.value));
    });
  });
}

function initModelUpload() {
  const input = document.getElementById('model-file-input');
  if (!input) return;
  const saved = Store.getModelFileName();
  if (saved) document.getElementById('model-filename').textContent = saved + ' (upload ulang diperlukan)';

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    document.getElementById('model-filename').textContent = 'Memuat ' + file.name + '…';
    Store.setModelFile(file);
  });
}

function init() {
  initSliders();
  initModelUpload();
  renderMarkerList();

  Store.onChange(changed => {
    if (changed === 'markers') renderMarkerList();
    if (changed === 'model') {
      const name = Store.getModelFileName();
      if (name) document.getElementById('model-filename').textContent = '✓ ' + name;
    }
  });

  document.getElementById('input-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') addMarker();
  });
}

window.UI = {
  init, openPanel, closePanel,
  openAddModal, closeAddModal, addMarker, removeMarker,
  openDownloadModal, closeDownloadModal,
};
