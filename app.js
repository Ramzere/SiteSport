// ============================================================
//  FITPRO — App Logic
// ============================================================

// ---------- STATE ----------
let currentPage = 'today';
let currentDayIdx = getTodayIdx();
let rmResult = null;

function getTodayIdx() {
  const jsDay = new Date().getDay(); // 0=Sun,1=Mon...5=Fri,6=Sat
  const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
  return map[jsDay] !== undefined ? map[jsDay] : 0;
}

// ---------- STORAGE ----------
function storageKey(suffix) { return `fitpro_${suffix}`; }

function getChecked(dayIdx) {
  try { return JSON.parse(localStorage.getItem(storageKey(`checked_${dayIdx}`))) || {}; }
  catch { return {}; }
}
function setChecked(dayIdx, obj) {
  localStorage.setItem(storageKey(`checked_${dayIdx}`), JSON.stringify(obj));
}
function getSavedRM() {
  try { return JSON.parse(localStorage.getItem(storageKey('rm'))) || {}; }
  catch { return {}; }
}
function setSavedRM(obj) {
  localStorage.setItem(storageKey('rm'), JSON.stringify(obj));
}
function getTheme() { return localStorage.getItem(storageKey('theme')) || 'dark'; }
function setTheme(t) { localStorage.setItem(storageKey('theme'), t); }

// ---------- THEME ----------
function applyTheme(t) {
  document.body.classList.toggle('dark', t === 'dark');
  document.body.classList.toggle('light', t === 'light');
}
function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  setTheme(next);
}

// ---------- NAVIGATION ----------
function showPage(name) {
  currentPage = name;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelector(`[data-page="${name}"]`).classList.add('active');
  if (name === 'today') renderToday();
  if (name === 'week') renderWeek();
  if (name === 'test') renderSavedRM();
}

// ---------- DATE ----------
function formatDate() {
  const d = new Date();
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

// ---------- RENDER TODAY ----------
function renderToday() {
  const dayData = PROGRAM[currentDayIdx];
  const checked = getChecked(currentDayIdx);

  // Hero
  document.getElementById('dayBadge').textContent = dayData.label.toUpperCase();
  document.getElementById('dayTitle').textContent = dayData.typeLabel;
  document.getElementById('daySubtitle').textContent = dayData.title;
  document.getElementById('dayDuration').textContent = dayData.duration;

  // Color accent
  const hero = document.getElementById('dayHero');
  hero.style.setProperty('--day-color', dayData.color);

  // Build exercises list
  const saved = getSavedRM();
  let totalEx = 0;
  let doneEx = 0;
  let html = '';

  dayData.sections.forEach(section => {
    html += `<div class="section-block">
      <div class="section-header">
        <span class="section-icon">${section.icon}</span>
        <span class="section-name">${section.name}</span>
      </div>`;

    section.exercises.forEach(ex => {
      totalEx++;
      const isDone = !!checked[ex.id];
      if (isDone) doneEx++;

      // Load saved weight suggestion
      let weightHint = '';
      if (ex.rmKey && saved[ex.rmKey]) {
        const rm1 = saved[ex.rmKey].rm1;
        const pct = ex.targetPct || 0.75;
        const suggested = roundToNearest(rm1 * pct, 2.5);
        weightHint = `<span class="weight-hint">💾 Charge suggérée : <strong>${suggested} kg</strong></span>`;
      }

      html += `
        <div class="exercise-item ${isDone ? 'done' : ''}" id="ex_${ex.id}">
          <button class="check-btn ${isDone ? 'checked' : ''}" onclick="toggleEx('${ex.id}', ${currentDayIdx})" aria-label="Cocher ${ex.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <div class="ex-body">
            <p class="ex-name">${ex.name}</p>
            <p class="ex-sets">${ex.sets}</p>
            ${ex.rest ? `<p class="ex-rest">⏱ ${ex.rest}</p>` : ''}
            ${ex.note ? `<p class="ex-note">${ex.note}</p>` : ''}
            ${ex.warn ? `<p class="ex-warn">⚠️ ${ex.warn}</p>` : ''}
            ${weightHint}
          </div>
        </div>`;
    });

    html += `</div>`;
  });

  // Cooldown
  if (dayData.cooldown && dayData.cooldown.length > 0) {
    html += `<div class="section-block cooldown-block">
      <div class="section-header">
        <span class="section-icon">❄️</span>
        <span class="section-name">Récupération</span>
      </div>`;
    dayData.cooldown.forEach((c, i) => {
      const cid = `cool_${currentDayIdx}_${i}`;
      const isDone = !!checked[cid];
      if (!isDone) {} // not counted in progress
      html += `<div class="exercise-item cool-item ${isDone ? 'done' : ''}" id="ex_${cid}">
        <button class="check-btn ${isDone ? 'checked' : ''}" onclick="toggleEx('${cid}', ${currentDayIdx})" aria-label="Cocher récupération">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <div class="ex-body"><p class="ex-name">${c}</p></div>
      </div>`;
    });
    html += `</div>`;
  }

  document.getElementById('sessionContent').innerHTML = html;

  // Progress
  const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
  document.getElementById('progressPill').textContent = `${pct}% complété`;
  document.getElementById('progressFill').style.width = `${pct}%`;
}

function toggleEx(exId, dayIdx) {
  const checked = getChecked(dayIdx);
  checked[exId] = !checked[exId];
  setChecked(dayIdx, checked);
  renderToday();
  // Haptic feedback on iOS
  if (navigator.vibrate) navigator.vibrate(10);
}

function resetDay() {
  if (confirm('Réinitialiser toute la séance ?')) {
    localStorage.removeItem(storageKey(`checked_${currentDayIdx}`));
    renderToday();
  }
}

// ---------- RENDER WEEK ----------
function renderWeek() {
  const today = getTodayIdx();
  let html = '';
  PROGRAM.forEach((day, i) => {
    const checked = getChecked(i);
    const allEx = day.sections.flatMap(s => s.exercises);
    const done = allEx.filter(ex => checked[ex.id]).length;
    const pct = allEx.length > 0 ? Math.round((done / allEx.length) * 100) : 0;
    const isToday = i === today;

    html += `
      <div class="week-card ${isToday ? 'today' : ''}" onclick="goToDay(${i})" style="--day-color:${day.color}">
        <div class="week-card-top">
          <div>
            <span class="week-day-label">${day.label}</span>
            <span class="week-type-badge" style="background:${day.color}22;color:${day.color}">${day.typeLabel}</span>
          </div>
          ${isToday ? '<span class="today-dot">Aujourd\'hui</span>' : ''}
        </div>
        <p class="week-title">${day.title}</p>
        <p class="week-sub">${day.subtitle}</p>
        <div class="week-footer">
          <div class="week-progress-track">
            <div class="week-progress-fill" style="width:${pct}%;background:${day.color}"></div>
          </div>
          <span class="week-pct">${pct}%</span>
        </div>
      </div>`;
  });
  document.getElementById('weekGrid').innerHTML = html;
}

function goToDay(idx) {
  currentDayIdx = idx;
  showPage('today');
}

// ---------- 1RM CALCULATOR ----------
function calculateRM() {
  const weight = parseFloat(document.getElementById('rmWeight').value);
  const reps = parseInt(document.getElementById('rmReps').value);
  if (!weight || !reps || weight <= 0 || reps <= 0) {
    alert('Entre un poids et un nombre de reps valides.');
    return;
  }

  // Brzycki formula
  const rm1 = weight / (1.0278 - 0.0278 * reps);
  const rm1rounded = roundToNearest(rm1, 0.5);

  const exerciseKey = document.getElementById('rmExercise').value;
  const exerciseLabel = RM_EXERCISES[exerciseKey].label;

  rmResult = { rm1: rm1rounded, weight, reps, exerciseKey, exerciseLabel, date: new Date().toLocaleDateString('fr-FR') };

  document.getElementById('rmEstimated').textContent = `${rm1rounded} kg`;

  const zones = [
    { label: 'Échauffement', pct: 0.50, repsRec: '15–20', color: '#6EE7B7' },
    { label: 'Endurance force', pct: 0.60, repsRec: '15', color: '#34D399' },
    { label: 'Hypertrophie légère', pct: 0.70, repsRec: '12–15', color: '#10B981' },
    { label: 'Hypertrophie', pct: 0.75, repsRec: '10–12', color: '#059669' },
    { label: 'Force–Hypertrophie', pct: 0.80, repsRec: '8–10', color: '#047857' },
    { label: 'Force', pct: 0.85, repsRec: '6–8', color: '#065F46' },
    { label: 'Force maximale', pct: 0.90, repsRec: '4–6', color: '#064E3B' },
  ];

  let zonesHtml = '';
  zones.forEach(z => {
    const kg = roundToNearest(rm1 * z.pct, 2.5);
    zonesHtml += `
      <div class="zone-row">
        <div class="zone-left">
          <span class="zone-dot" style="background:${z.color}"></span>
          <span class="zone-label">${z.label}</span>
        </div>
        <div class="zone-right">
          <span class="zone-kg">${kg} kg</span>
          <span class="zone-reps">${z.repsRec} reps</span>
        </div>
      </div>`;
  });
  document.getElementById('rmZones').innerHTML = zonesHtml;

  // Sets table for this exercise
  const setsData = [
    { type: 'Séance débutant', sets: '3', reps: '12', pct: 0.70 },
    { type: 'Séance intermédiaire', sets: '4', reps: '8–10', pct: 0.78 },
    { type: 'Séance force', sets: '5', reps: '6', pct: 0.85 },
  ];
  let tableHtml = `<p class="sets-table-title">Prescription séances — ${exerciseLabel}</p>`;
  setsData.forEach(s => {
    const kg = roundToNearest(rm1 * s.pct, 2.5);
    tableHtml += `
      <div class="sets-row">
        <span class="sets-type">${s.type}</span>
        <span class="sets-config">${s.sets} × ${s.reps} @ <strong>${kg} kg</strong></span>
      </div>`;
  });
  document.getElementById('rmSetsTable').innerHTML = tableHtml;

  document.getElementById('rmResult').style.display = 'block';
  document.getElementById('rmResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveRM() {
  if (!rmResult) return;
  const saved = getSavedRM();
  saved[rmResult.exerciseKey] = {
    rm1: rmResult.rm1,
    label: rmResult.exerciseLabel,
    date: rmResult.date,
    weight: rmResult.weight,
    reps: rmResult.reps
  };
  setSavedRM(saved);
  renderSavedRM();
  // Visual feedback
  const btn = document.querySelector('.save-btn');
  btn.textContent = '✅ Sauvegardé !';
  setTimeout(() => {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Sauvegarder ces charges`;
  }, 2000);
}

function deleteRM(key) {
  const saved = getSavedRM();
  delete saved[key];
  setSavedRM(saved);
  renderSavedRM();
}

function renderSavedRM() {
  const saved = getSavedRM();
  const keys = Object.keys(saved);
  const section = document.getElementById('savedRmSection');
  const list = document.getElementById('savedRmList');
  if (keys.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  list.innerHTML = keys.map(k => {
    const r = saved[k];
    return `
      <div class="saved-rm-card">
        <div class="saved-rm-left">
          <p class="saved-rm-name">${r.label}</p>
          <p class="saved-rm-detail">Testé : ${r.weight} kg × ${r.reps} reps · ${r.date}</p>
        </div>
        <div class="saved-rm-right">
          <span class="saved-rm-value">${r.rm1} kg</span>
          <button class="delete-rm-btn" onclick="deleteRM('${k}')" aria-label="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');
}

// ---------- UTILS ----------
function roundToNearest(val, step) {
  return Math.round(val / step) * step;
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  document.getElementById('headerDate').textContent = formatDate();
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  renderToday();
  renderSavedRM();
});
