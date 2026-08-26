// ============================================================
//  FITPRO v4.0 — App Logic
//  © 2025 RémiRodriguez
//  + Timer de repos automatique
//  + Journal de charges avec progression
//  + Prise en séance améliorée : multi-séries, +/- poids, remplissage auto
// ============================================================

// ---------- STATE ----------
let currentPage = 'today';
let currentDayIdx = getTodayIdx();
let rmResult = null;
let selectedJournalExercise = null;

// TIMER STATE
let timerInterval = null;
let timerTotal = 0;
let timerRemaining = 0;
let timerPaused = false;
let timerNextExName = '';
const CIRCUMFERENCE = 2 * Math.PI * 52; // ring r=52

function getTodayIdx() {
  const jsDay = new Date().getDay();
  const map = { 1:0, 2:1, 3:2, 4:3, 5:4 };
  return map[jsDay] !== undefined ? map[jsDay] : 0;
}

// ---------- STORAGE ----------
function sk(suffix) { return 'fitpro_' + suffix; }
function getChecked(d) { try { return JSON.parse(localStorage.getItem(sk('checked_'+d))) || {}; } catch { return {}; } }
function setChecked(d, o) { localStorage.setItem(sk('checked_'+d), JSON.stringify(o)); }
function getSavedRM() { try { return JSON.parse(localStorage.getItem(sk('rm'))) || {}; } catch { return {}; } }
function setSavedRM(o) { localStorage.setItem(sk('rm'), JSON.stringify(o)); }
function getTheme() { return localStorage.getItem(sk('theme')) || 'dark'; }
function setThemeSt(t) { localStorage.setItem(sk('theme'), t); }

// JOURNAL STORAGE — structure: { exId: [ entry, ... ] }
// Strength/bodyweight entry: { date, ts, note, weight, reps }
// Cardio entry:              { date, ts, note, duration, distance }
function getJournal() { try { return JSON.parse(localStorage.getItem(sk('journal'))) || {}; } catch { return {}; } }
function setJournal(o) { localStorage.setItem(sk('journal'), JSON.stringify(o)); }

function addJournalEntry(exId, weight, reps, note) {
  const j = getJournal();
  if (!j[exId]) j[exId] = [];
  j[exId].unshift({ date: todayISO(), weight: parseFloat(weight), reps: parseInt(reps), note: note || '', ts: Date.now() });
  // Keep max 52 entries per exercise
  if (j[exId].length > 52) j[exId] = j[exId].slice(0, 52);
  setJournal(j);
}

function addCardioJournalEntry(exId, duration, distance, note) {
  const j = getJournal();
  if (!j[exId]) j[exId] = [];
  j[exId].unshift({
    date: todayISO(),
    duration: duration ? parseFloat(duration) : null,
    distance: distance ? parseFloat(distance) : null,
    note: note || '',
    ts: Date.now()
  });
  if (j[exId].length > 52) j[exId] = j[exId].slice(0, 52);
  setJournal(j);
}

function deleteJournalEntry(exId, ts) {
  const j = getJournal();
  if (j[exId]) j[exId] = j[exId].filter(e => e.ts !== ts);
  setJournal(j);
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDateFR(iso) {
  const [y, m, day] = iso.split('-');
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}

function formatCardioVal(entry) {
  const parts = [];
  if (entry.duration) parts.push(`${entry.duration} min`);
  if (entry.distance) parts.push(`${entry.distance} km`);
  return parts.length > 0 ? parts.join(' · ') : '—';
}

// ---------- THEME ----------
function applyTheme(t) {
  document.body.classList.toggle('dark', t === 'dark');
  document.body.classList.toggle('light', t === 'light');
  const meta = document.getElementById('themeColor');
  if (meta) meta.content = t === 'dark' ? '#0A0A0A' : '#F0F0EE';
}
function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next); setThemeSt(next);
}

// ---------- NAV ----------
function showPage(name) {
  currentPage = name;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelector('[data-page="'+name+'"]').classList.add('active');
  if (name === 'today') renderToday();
  if (name === 'week') renderWeek();
  if (name === 'journal') renderJournalPicker();
  if (name === 'test') { populateRMSelect(); renderSavedRM(); }
}

function formatDate() {
  const d = new Date();
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
}

// ============================================================
//  TIMER
// ============================================================

function parseRestSeconds(restStr) {
  if (!restStr) return 0;
  const s = restStr.toLowerCase();
  if (s.includes('2 min 30') || s.includes('2min30')) return 150;
  if (s.includes('2 min') || s.includes('2min')) return 120;
  if (s.includes('90 sec') || s.includes('90sec')) return 90;
  if (s.includes('75 sec') || s.includes('75sec')) return 75;
  if (s.includes('60 sec') || s.includes('60sec') || s.includes('1 min')) return 60;
  if (s.includes('45 sec') || s.includes('45sec')) return 45;
  if (s.includes('30 sec') || s.includes('30sec')) return 30;
  if (s.includes('20 sec') || s.includes('20sec')) return 20;
  if (s.includes('15 sec') || s.includes('15sec')) return 15;
  // "enchaîner" = no rest
  if (s.includes('enchaîner') || s.includes('0 sec')) return 0;
  return 0;
}

function startTimer(seconds, labelText, nextExName) {
  if (seconds <= 0) return;
  stopTimer();
  timerTotal = seconds;
  timerRemaining = seconds;
  timerPaused = false;
  timerNextExName = nextExName || '';

  document.getElementById('timerLabel').textContent = labelText || 'Repos';
  document.getElementById('timerNext').textContent = nextExName ? 'Prochain : ' + nextExName : '';
  document.getElementById('timerPauseBtn').textContent = 'Pause';
  document.getElementById('timerOverlay').style.display = 'flex';
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (!timerPaused) {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        timerFinished();
      }
    }
  }, 1000);

  // Keep screen awake
  requestWakeLock();
}

function updateTimerDisplay() {
  const min = Math.floor(timerRemaining / 60);
  const sec = timerRemaining % 60;
  document.getElementById('timerDisplay').textContent = min + ':' + String(sec).padStart(2, '0');

  // Ring animation
  const pct = timerRemaining / timerTotal;
  const offset = CIRCUMFERENCE * (1 - pct);
  const ring = document.getElementById('ringFill');
  if (ring) {
    ring.style.strokeDasharray = CIRCUMFERENCE;
    ring.style.strokeDashoffset = offset;
  }

  // Color warning
  const timerCard = document.querySelector('.timer-card');
  if (timerCard) {
    timerCard.classList.toggle('timer-warning', timerRemaining <= 5 && timerRemaining > 0);
  }
}

function timerFinished() {
  document.getElementById('timerOverlay').style.display = 'none';
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  releaseWakeLock();
}

function pauseTimer() {
  timerPaused = !timerPaused;
  document.getElementById('timerPauseBtn').textContent = timerPaused ? 'Reprendre' : 'Pause';
}

function skipTimer() {
  stopTimer();
  document.getElementById('timerOverlay').style.display = 'none';
  releaseWakeLock();
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  timerPaused = false;
}

// Wake Lock API
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
  } catch(e) {}
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

// ============================================================
//  SERIES DOTS HELPERS
// ============================================================

// Extract number of sets from a sets string like "4 × 8", "3 × 12", "5 × 8 reps"
function parseSetsCount(setsStr) {
  if (!setsStr) return 0;
  const m = setsStr.match(/^(\d+)\s*[x×]/);
  return m ? parseInt(m[1]) : 0;
}

// Storage key for series dots per exercise
function seriesKey(dayIdx, exId) { return sk('series_' + dayIdx + '_' + exId); }
function getSeriesDone(dayIdx, exId) {
  try { return parseInt(localStorage.getItem(seriesKey(dayIdx, exId))) || 0; }
  catch { return 0; }
}
function setSeriesDone(dayIdx, exId, n) {
  localStorage.setItem(seriesKey(dayIdx, exId), String(n));
}

// ============================================================
//  TODAY PAGE
// ============================================================

// Current log state
let currentLogExId = '';
let currentLogExName = '';
// Multi-series log: array of {weight, reps}
let currentLogSeries = [];

function renderToday() {
  const dayData = PROGRAM[currentDayIdx];
  const checked = getChecked(currentDayIdx);

  document.getElementById('dayBadge').textContent = dayData.label.toUpperCase();
  document.getElementById('dayTitle').textContent = dayData.typeLabel;
  document.getElementById('daySubtitle').textContent = dayData.title;
  document.getElementById('dayDuration').textContent = dayData.duration;
  document.getElementById('dayHero').style.setProperty('--day-color', dayData.color);

  const saved = getSavedRM();
  const journal = getJournal();
  let totalEx = 0, doneEx = 0;
  let html = '';
  const allExFlat = dayData.sections.flatMap(s => s.exercises);

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

      const flatIdx = allExFlat.findIndex(e => e.id === ex.id);
      const nextEx = allExFlat[flatIdx + 1];
      const nextName = nextEx ? nextEx.name : '';

      const logType = ex.logType || 'strength';

      // Suggested weight from 1RM
      let suggestedKg = null;
      if (ex.rmKey && saved[ex.rmKey]) {
        suggestedKg = roundToNearest(saved[ex.rmKey].rm1 * (ex.targetPct || 0.75), 2.5);
      }

      // Last journal entries (max 3)
      const jEntries = (journal[ex.id] || []).slice(0, 3);
      const lastEntry = jEntries.length > 0 ? jEntries[0] : null;

      // Series dots
      const nSets = parseSetsCount(ex.sets);
      const seriesDone = getSeriesDone(currentDayIdx, ex.id);
      let dotsHtml = '';
      if (nSets > 0) {
        const restSec = parseRestSeconds(ex.rest);
        const safeNext = nextName.replace(/'/g,"\'").replace(/`/g,'');
        const safeRest = (ex.rest||'').replace(/'/g,"\'");
        let dots = '';
        for (let si = 0; si < nSets; si++) {
          const dotDone = si < seriesDone;
          dots += `<button class="series-dot ${dotDone ? 'dot-done' : ''}"
            onclick="tickSerie('${ex.id}',${currentDayIdx},${si},${nSets},${restSec},'${safeRest}','${safeNext}')"
            aria-label="Série ${si+1}">
            <span class="dot-num">${si+1}</span>
          </button>`;
        }
        dotsHtml = `<div class="series-dots-row">${dots}<span class="dots-label">${seriesDone}/${nSets} séries</span></div>`;
      }

      html += `<div class="exercise-item ${isDone ? 'done' : ''}" id="ex_${ex.id}">
        <button class="check-btn ${isDone ? 'checked' : ''}"
          onclick="toggleEx('${ex.id}',${currentDayIdx},0,'','${nextName.replace(/'/g,"\'")}','')"
          aria-label="Cocher ${ex.name}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <div class="ex-body">
          <p class="ex-name">${ex.name}</p>
          <p class="ex-sets">${ex.sets}</p>
          ${dotsHtml}
          ${ex.rest ? `<p class="ex-rest">⏱ ${ex.rest}</p>` : ''}
          ${ex.note ? `<p class="ex-note">${ex.note}</p>` : ''}
          ${ex.warn ? `<p class="ex-warn">⚠️ ${ex.warn}</p>` : ''}
          ${suggestedKg !== null ? `<div class="hint-row"><span class="hint-badge">📊 Suggéré</span><span class="hint-val">${suggestedKg} kg</span></div>` : ''}
          ${lastEntry && logType === 'strength' ? `<div class="hint-row"><span class="hint-badge">🕐 Dernière fois</span><span class="hint-val">${lastEntry.weight} kg × ${lastEntry.reps}</span><span class="hint-date">${formatDateFR(lastEntry.date)}</span></div>` : ''}
          ${lastEntry && logType === 'cardio' ? `<div class="hint-row"><span class="hint-badge">🕐 Dernière fois</span><span class="hint-val">${formatCardioVal(lastEntry)}</span><span class="hint-date">${formatDateFR(lastEntry.date)}</span></div>` : ''}
          ${logType === 'strength' ? `<button class="log-btn" onclick="openLogModal('${ex.id}','${ex.name.replace(/'/g,"\'")}',${suggestedKg||0},${lastEntry ? lastEntry.weight : 0},${lastEntry ? lastEntry.reps : 0})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            ${jEntries.length > 0 ? 'Saisir cette séance' : 'Enregistrer charges'}
          </button>` : ''}
          ${logType === 'cardio' ? `<button class="log-btn" onclick="openCardioLogModal('${ex.id}','${ex.name.replace(/'/g,"\'")}',${lastEntry && lastEntry.duration ? lastEntry.duration : 0},${lastEntry && lastEntry.distance ? lastEntry.distance : 0})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            ${jEntries.length > 0 ? 'Saisir cette séance' : 'Enregistrer la séance'}
          </button>` : ''}
        </div>
      </div>`;
    });
    html += `</div>`;
  });

  // Cooldown
  if (dayData.cooldown && dayData.cooldown.length > 0) {
    html += `<div class="section-block cooldown-block"><div class="section-header"><span class="section-icon">❄️</span><span class="section-name">Récupération</span></div>`;
    dayData.cooldown.forEach((c, i) => {
      const cid = `cool_${currentDayIdx}_${i}`;
      const isDone = !!checked[cid];
      html += `<div class="exercise-item ${isDone ? 'done' : ''}">
        <button class="check-btn ${isDone ? 'checked' : ''}" onclick="toggleEx('${cid}',${currentDayIdx},0,'','','')" aria-label="Cocher">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <div class="ex-body"><p class="ex-name">${c}</p></div>
      </div>`;
    });
    html += `</div>`;
  }

  document.getElementById('sessionContent').innerHTML = html;
  injectLogModal();

  const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
  document.getElementById('progressPill').textContent = pct + '% complété';
  document.getElementById('progressFill').style.width = pct + '%';
  if (pct === 100 && totalEx > 0) showCelebration();
}

// ── MODAL INJECTION ──────────────────────────────────────────
function injectLogModal() {
  if (document.getElementById('logModal')) return;
  const modal = document.createElement('div');
  modal.id = 'logModal';
  modal.className = 'log-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="log-modal-card">
      <!-- Header -->
      <div class="lm-header">
        <div>
          <p class="lm-title" id="logModalTitle">Enregistrer</p>
          <p class="lm-subtitle" id="logModalSub"></p>
        </div>
        <button class="lm-close" onclick="closeLogModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Série input -->
      <div class="lm-input-block">
        <p class="lm-section-label">Nouvelle série</p>
        <div class="lm-weight-row">
          <button class="lm-step-btn" onclick="stepWeight(-2.5)">−2.5</button>
          <div class="lm-field-wrap">
            <input class="lm-input-big" type="number" id="logWeight" placeholder="kg" min="0" max="500" step="0.5" inputmode="decimal"/>
            <span class="lm-input-unit">kg</span>
          </div>
          <button class="lm-step-btn" onclick="stepWeight(+2.5)">+2.5</button>
        </div>
        <div class="lm-reps-row">
          <button class="lm-step-btn" onclick="stepReps(-1)">−1</button>
          <div class="lm-field-wrap">
            <input class="lm-input-big" type="number" id="logReps" placeholder="reps" min="1" max="100" inputmode="numeric"/>
            <span class="lm-input-unit">reps</span>
          </div>
          <button class="lm-step-btn" onclick="stepReps(+1)">+1</button>
        </div>
        <button class="lm-add-serie-btn" onclick="addSerie()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter cette série
        </button>
      </div>

      <!-- Series logged so far -->
      <div id="logSeriesList" class="lm-series-list"></div>

      <!-- Note -->
      <div class="lm-note-row">
        <input class="lm-note-input" type="text" id="logNote" placeholder="Note (feeling, douleur...)"/>
      </div>

      <!-- Footer -->
      <div class="lm-footer">
        <button class="log-cancel-btn" onclick="closeLogModal()">Annuler</button>
        <button class="log-save-btn" onclick="saveLogEntry()">Sauvegarder</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

// ── CARDIO MODAL ─────────────────────────────────────────────
let currentCardioExId = '';

function injectCardioLogModal() {
  if (document.getElementById('cardioLogModal')) return;
  const modal = document.createElement('div');
  modal.id = 'cardioLogModal';
  modal.className = 'log-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="log-modal-card">
      <div class="lm-header">
        <div>
          <p class="lm-title" id="cardioModalTitle">Enregistrer</p>
          <p class="lm-subtitle" id="cardioModalSub"></p>
        </div>
        <button class="lm-close" onclick="closeCardioLogModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="lm-input-block">
        <p class="lm-section-label">Durée</p>
        <div class="lm-weight-row">
          <button class="lm-step-btn" onclick="stepCardio('duration',-5)">−5</button>
          <div class="lm-field-wrap">
            <input class="lm-input-big" type="number" id="cardioDuration" placeholder="min" min="0" max="600" step="1" inputmode="numeric"/>
            <span class="lm-input-unit">min</span>
          </div>
          <button class="lm-step-btn" onclick="stepCardio('duration',5)">+5</button>
        </div>
        <p class="lm-section-label">Distance (optionnel)</p>
        <div class="lm-reps-row">
          <button class="lm-step-btn" onclick="stepCardio('distance',-1)">−1</button>
          <div class="lm-field-wrap">
            <input class="lm-input-big" type="number" id="cardioDistance" placeholder="km" min="0" max="300" step="0.5" inputmode="decimal"/>
            <span class="lm-input-unit">km</span>
          </div>
          <button class="lm-step-btn" onclick="stepCardio('distance',1)">+1</button>
        </div>
      </div>

      <div class="lm-note-row">
        <input class="lm-note-input" type="text" id="cardioNote" placeholder="Note (ressenti, douleur...)"/>
      </div>

      <div class="lm-footer">
        <button class="log-cancel-btn" onclick="closeCardioLogModal()">Annuler</button>
        <button class="log-save-btn" onclick="saveCardioLogEntry()">Sauvegarder</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function openCardioLogModal(exId, exName, lastDuration, lastDistance) {
  injectCardioLogModal();
  currentCardioExId = exId;
  document.getElementById('cardioModalTitle').textContent = exName;

  let sub = '';
  if (lastDuration > 0 || lastDistance > 0) sub = `🕐 Dernière : ${lastDuration > 0 ? lastDuration + ' min' : ''}${lastDuration > 0 && lastDistance > 0 ? ' · ' : ''}${lastDistance > 0 ? lastDistance + ' km' : ''}`;
  document.getElementById('cardioModalSub').textContent = sub;

  document.getElementById('cardioDuration').value = lastDuration > 0 ? lastDuration : '';
  document.getElementById('cardioDistance').value = lastDistance > 0 ? lastDistance : '';
  document.getElementById('cardioNote').value = '';

  document.getElementById('cardioLogModal').style.display = 'flex';
  setTimeout(() => document.getElementById('cardioDuration').focus(), 120);
}

function closeCardioLogModal() {
  const m = document.getElementById('cardioLogModal');
  if (m) m.style.display = 'none';
}

function stepCardio(field, delta) {
  const el = document.getElementById(field === 'duration' ? 'cardioDuration' : 'cardioDistance');
  const cur = parseFloat(el.value) || 0;
  el.value = Math.max(0, cur + delta);
}

function saveCardioLogEntry() {
  const duration = document.getElementById('cardioDuration').value;
  const distance = document.getElementById('cardioDistance').value;
  const note = document.getElementById('cardioNote').value;
  if (!duration && !distance) { showToast('⚠️ Entre au moins la durée ou la distance'); return; }
  addCardioJournalEntry(currentCardioExId, duration, distance, note);
  closeCardioLogModal();
  renderToday();
  showToast('✅ Séance enregistrée');
}

// ── MODAL LOGIC ──────────────────────────────────────────────
function openLogModal(exId, exName, suggestedKg, lastWeight, lastReps) {
  currentLogExId = exId;
  currentLogExName = exName;
  currentLogSeries = [];

  document.getElementById('logModalTitle').textContent = exName;

  // Build subtitle from suggestions
  let sub = '';
  if (suggestedKg > 0) sub += `📊 Suggéré : ${suggestedKg} kg`;
  if (lastWeight > 0) sub += (sub ? '  ·  ' : '') + `🕐 Dernière : ${lastWeight} kg × ${lastReps}`;
  document.getElementById('logModalSub').textContent = sub;

  // Pre-fill with last weight or suggested
  const prefillW = lastWeight > 0 ? lastWeight : (suggestedKg > 0 ? suggestedKg : '');
  const prefillR = lastReps > 0 ? lastReps : '';
  document.getElementById('logWeight').value = prefillW;
  document.getElementById('logReps').value = prefillR;
  document.getElementById('logNote').value = '';

  renderSeriesList();
  document.getElementById('logModal').style.display = 'flex';
  setTimeout(() => document.getElementById('logWeight').focus(), 120);
}

function closeLogModal() {
  document.getElementById('logModal').style.display = 'none';
  currentLogSeries = [];
}

function stepWeight(delta) {
  const el = document.getElementById('logWeight');
  const cur = parseFloat(el.value) || 0;
  el.value = Math.max(0, roundToNearest(cur + delta, 0.5));
}

function stepReps(delta) {
  const el = document.getElementById('logReps');
  const cur = parseInt(el.value) || 0;
  el.value = Math.max(1, cur + delta);
}

function addSerie() {
  const w = parseFloat(document.getElementById('logWeight').value);
  const r = parseInt(document.getElementById('logReps').value);
  if (!w || !r) { showToast('⚠️ Entre poids et reps'); return; }
  currentLogSeries.push({ weight: w, reps: r });
  renderSeriesList();
  if (navigator.vibrate) navigator.vibrate(8);
  // keep same weight for next series, clear reps for re-entry
  // (user usually keeps same weight, changes reps)
}

function removeSerie(idx) {
  currentLogSeries.splice(idx, 1);
  renderSeriesList();
}

function renderSeriesList() {
  const el = document.getElementById('logSeriesList');
  if (!el) return;
  if (currentLogSeries.length === 0) {
    el.innerHTML = '';
    return;
  }
  const totalVol = currentLogSeries.reduce((s, e) => s + e.weight * e.reps, 0);
  let html = `<p class="lm-section-label">Séries enregistrées <span class="lm-vol-badge">Vol. ${totalVol.toFixed(0)} kg</span></p>`;
  currentLogSeries.forEach((s, i) => {
    html += `<div class="lm-serie-row">
      <span class="lm-serie-num">S${i+1}</span>
      <span class="lm-serie-val">${s.weight} kg × ${s.reps}</span>
      <button class="lm-serie-del" onclick="removeSerie(${i})" aria-label="Supprimer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`;
  });
  el.innerHTML = html;
}

function saveLogEntry() {
  const note = document.getElementById('logNote').value;

  // If there are logged series, save each one
  if (currentLogSeries.length > 0) {
    currentLogSeries.forEach((s, i) => {
      addJournalEntry(currentLogExId, s.weight, s.reps, i === 0 ? note : '');
    });
    closeLogModal();
    renderToday();
    showToast(`✅ ${currentLogSeries.length} série${currentLogSeries.length > 1 ? 's' : ''} enregistrée${currentLogSeries.length > 1 ? 's' : ''}`);
    return;
  }

  // Fallback: single entry from weight/reps fields
  const w = document.getElementById('logWeight').value;
  const r = document.getElementById('logReps').value;
  if (!w || !r) { showToast('⚠️ Ajoute au moins une série'); return; }
  addJournalEntry(currentLogExId, w, r, note);
  closeLogModal();
  renderToday();
  showToast('✅ Charge enregistrée');
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function showCelebration() {
  let c = document.getElementById('celebration');
  if (!c) {
    c = document.createElement('div');
    c.id = 'celebration';
    c.className = 'celebration';
    c.innerHTML = '<div class="celeb-inner"><span class="celeb-emoji">🏆</span><p class="celeb-text">Séance terminée !</p><p class="celeb-sub">Excellent travail</p><button onclick="this.parentElement.parentElement.style.display=\'none\'">OK</button></div>';
    document.body.appendChild(c);
  }
  c.style.display = 'flex';
}

function toggleEx(exId, dayIdx, restSec, restLabel, nextName, exName) {
  const checked = getChecked(dayIdx);
  const wasChecked = !!checked[exId];
  checked[exId] = !wasChecked;
  setChecked(dayIdx, checked);
  if (navigator.vibrate) navigator.vibrate(10);

  // Start timer when checking (not unchecking), and there's a real rest time
  if (!wasChecked && restSec > 0) {
    startTimer(restSec, restLabel || 'Repos', nextName);
  }

  renderToday();
}

function tickSerie(exId, dayIdx, serieIdx, totalSets, restSec, restLabel, nextName) {
  const current = getSeriesDone(dayIdx, exId);
  // Toggle: if clicking already-done dot, undo from that point; if clicking next, mark done
  const newCount = serieIdx < current ? serieIdx : serieIdx + 1;
  setSeriesDone(dayIdx, exId, newCount);
  if (navigator.vibrate) navigator.vibrate(10);

  // Auto-check exercise when all sets done
  if (newCount >= totalSets) {
    const checked = getChecked(dayIdx);
    if (!checked[exId]) {
      checked[exId] = true;
      setChecked(dayIdx, checked);
    }
    // Start rest timer only on last set
    if (restSec > 0) startTimer(restSec, restLabel || 'Repos', nextName);
  } else if (newCount > 0 && restSec > 0) {
    // Start rest timer between sets
    const remaining = totalSets - newCount;
    startTimer(restSec, restLabel || 'Repos entre séries', `Encore ${remaining} série${remaining > 1 ? 's' : ''}`);
  }
  renderToday();
}

function resetDay() {
  if (confirm('Réinitialiser toute la séance ?')) {
    localStorage.removeItem(sk('checked_' + currentDayIdx));
    // Clear all series dots for this day
    const dayData = PROGRAM[currentDayIdx];
    dayData.sections.forEach(s => s.exercises.forEach(ex => {
      localStorage.removeItem(seriesKey(currentDayIdx, ex.id));
    }));
    stopTimer();
    document.getElementById('timerOverlay').style.display = 'none';
    renderToday();
  }
}

// ============================================================
//  WEEK PAGE
// ============================================================

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

// ============================================================
//  JOURNAL PAGE
// ============================================================

// Build list of ALL exercises from the program (every day, every section)
function getLoggableExercises() {
  const list = [];
  const seen = new Set();
  PROGRAM.forEach(day => {
    day.sections.forEach(sec => {
      sec.exercises.forEach(ex => {
        if (!seen.has(ex.id)) {
          seen.add(ex.id);
          list.push({ id: ex.id, name: ex.name, day: day.label, color: day.color, logType: ex.logType || 'strength' });
        }
      });
    });
  });
  return list;
}

let journalDayFilter = 'all';

function renderJournalPicker() {
  const exList = getLoggableExercises();
  if (!selectedJournalExercise && exList.length > 0) selectedJournalExercise = exList[0].id;

  const days = PROGRAM.map(d => d.label);

  let filterHtml = `<div class="journal-day-filter">
    <button class="journal-day-pill ${journalDayFilter === 'all' ? 'active' : ''}" onclick="setJournalDayFilter('all')">Tous</button>
    ${days.map(d => `<button class="journal-day-pill ${journalDayFilter === d ? 'active' : ''}" onclick="setJournalDayFilter('${d}')">${d}</button>`).join('')}
  </div>`;

  const filtered = journalDayFilter === 'all' ? exList : exList.filter(ex => ex.day === journalDayFilter);
  if (!filtered.find(e => e.id === selectedJournalExercise) && filtered.length > 0) {
    selectedJournalExercise = filtered[0].id;
  }

  let html = '<div class="journal-picker-scroll">';
  filtered.forEach(ex => {
    html += `<button class="journal-pill ${selectedJournalExercise === ex.id ? 'active' : ''}"
      style="${selectedJournalExercise === ex.id ? '--pill-color:'+ex.color : ''}"
      onclick="selectJournalEx('${ex.id}')">${ex.name.split(' ').slice(0,3).join(' ')}</button>`;
  });
  html += '</div>';
  document.getElementById('journalPicker').innerHTML = filterHtml + html;
  renderJournalContent();
}

function setJournalDayFilter(day) {
  journalDayFilter = day;
  selectedJournalExercise = null;
  renderJournalPicker();
}

function selectJournalEx(exId) {
  selectedJournalExercise = exId;
  renderJournalPicker();
}

function renderJournalContent() {
  if (!selectedJournalExercise) {
    document.getElementById('journalContent').innerHTML = '<p style="padding:20px;color:var(--text3);font-size:13px">Sélectionne un exercice</p>';
    return;
  }

  const journal = getJournal();
  const entries = journal[selectedJournalExercise] || [];
  const exList = getLoggableExercises();
  const exInfo = exList.find(e => e.id === selectedJournalExercise);
  const logType = exInfo ? exInfo.logType : 'strength';

  let html = '';

  if (logType === 'cardio') {
    html += renderCardioStats(entries, exInfo);
  } else {
    html += renderStrengthStats(entries, exInfo);
  }

  // Entry list
  html += `<div class="journal-entries-header">
    <p class="journal-entries-title">Historique complet</p>
  </div>`;

  if (entries.length === 0) {
    html += `<div class="journal-empty">
      <p>Aucune entrée pour cet exercice.</p>
      <p style="font-size:12px;margin-top:6px">Coche un exercice et clique sur "+ Enregistrer" pendant ta séance.</p>
    </div>`;
  } else if (logType === 'cardio') {
    entries.forEach(e => {
      html += `<div class="journal-entry-card">
        <div class="jentry-left">
          <p class="jentry-date">${formatDateFR(e.date)}</p>
          ${e.note ? `<p class="jentry-note">${e.note}</p>` : ''}
        </div>
        <div class="jentry-right">
          <p class="jentry-main">${formatCardioVal(e)}</p>
        </div>
        <button class="jentry-delete" onclick="deleteEntry('${selectedJournalExercise}', ${e.ts})" aria-label="Supprimer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>`;
    });
  } else {
    entries.forEach(e => {
      const vol = (e.weight * e.reps).toFixed(0);
      html += `<div class="journal-entry-card">
        <div class="jentry-left">
          <p class="jentry-date">${formatDateFR(e.date)}</p>
          ${e.note ? `<p class="jentry-note">${e.note}</p>` : ''}
        </div>
        <div class="jentry-right">
          <p class="jentry-main">${e.weight} kg × ${e.reps}</p>
          <p class="jentry-vol">Vol. ${vol} kg</p>
        </div>
        <button class="jentry-delete" onclick="deleteEntry('${selectedJournalExercise}', ${e.ts})" aria-label="Supprimer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>`;
    });
  }

  document.getElementById('journalContent').innerHTML = html;
}

function renderStrengthStats(entries, exInfo) {
  if (entries.length === 0) return '';
  const weights = entries.map(e => e.weight);
  const maxW = Math.max(...weights);
  const lastW = entries[0].weight;
  const firstW = entries[entries.length-1].weight;
  const progression = lastW - firstW;

  let html = `<div class="journal-stats">
    <div class="jstat-card">
      <p class="jstat-label">Max soulevé</p>
      <p class="jstat-value" style="color:${exInfo ? exInfo.color : 'var(--text)'}">${maxW} kg</p>
    </div>
    <div class="jstat-card">
      <p class="jstat-label">Dernière séance</p>
      <p class="jstat-value">${lastW} kg</p>
    </div>
    <div class="jstat-card">
      <p class="jstat-label">Progression</p>
      <p class="jstat-value ${progression >= 0 ? 'pos' : 'neg'}">${progression >= 0 ? '+' : ''}${progression.toFixed(1)} kg</p>
    </div>
  </div>`;

  const chartEntries = [...entries].reverse().slice(-8);
  const maxChart = Math.max(...chartEntries.map(e => e.weight));
  html += `<div class="journal-chart">
    <p class="chart-title">Évolution du poids (${chartEntries.length} dernières séances)</p>
    <div class="chart-bars">`;
  chartEntries.forEach(e => {
    const h = Math.round((e.weight / maxChart) * 100);
    html += `<div class="chart-col">
      <span class="chart-val">${e.weight}</span>
      <div class="chart-bar-wrap">
        <div class="chart-bar" style="height:${h}%;background:${exInfo ? exInfo.color : '#888'}"></div>
      </div>
      <span class="chart-date">${e.date.slice(5).replace('-','/')}</span>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function renderCardioStats(entries, exInfo) {
  if (entries.length === 0) return '';
  const durations = entries.map(e => e.duration || 0);
  const distances = entries.map(e => e.distance || 0);
  const totalDuration = durations.reduce((a,b) => a+b, 0);
  const totalDistance = distances.reduce((a,b) => a+b, 0);
  const lastEntry = entries[0];

  let html = `<div class="journal-stats">
    <div class="jstat-card">
      <p class="jstat-label">Séances</p>
      <p class="jstat-value" style="color:${exInfo ? exInfo.color : 'var(--text)'}">${entries.length}</p>
    </div>
    <div class="jstat-card">
      <p class="jstat-label">Total durée</p>
      <p class="jstat-value">${totalDuration} min</p>
    </div>
    <div class="jstat-card">
      <p class="jstat-label">Total distance</p>
      <p class="jstat-value">${totalDistance.toFixed(0)} km</p>
    </div>
  </div>`;

  const hasDistance = distances.some(d => d > 0);
  const chartEntries = [...entries].reverse().slice(-8);
  const field = hasDistance ? 'distance' : 'duration';
  const maxChart = Math.max(...chartEntries.map(e => e[field] || 0), 1);
  html += `<div class="journal-chart">
    <p class="chart-title">Évolution ${hasDistance ? 'de la distance' : 'de la durée'} (${chartEntries.length} dernières séances)</p>
    <div class="chart-bars">`;
  chartEntries.forEach(e => {
    const val = e[field] || 0;
    const h = Math.round((val / maxChart) * 100);
    html += `<div class="chart-col">
      <span class="chart-val">${val}</span>
      <div class="chart-bar-wrap">
        <div class="chart-bar" style="height:${h}%;background:${exInfo ? exInfo.color : '#888'}"></div>
      </div>
      <span class="chart-date">${e.date.slice(5).replace('-','/')}</span>
    </div>`;
  });
  html += `</div></div>`;
  return html;
}

function deleteEntry(exId, ts) {
  deleteJournalEntry(exId, ts);
  renderJournalContent();
}

// ============================================================
//  1RM PAGE
// ============================================================

function populateRMSelect() {
  const sel = document.getElementById('rmExercise');
  if (sel.options.length > 0) return;
  Object.entries(RM_EXERCISES).forEach(([k, v]) => {
    const opt = document.createElement('option');
    opt.value = k; opt.textContent = v.label;
    sel.appendChild(opt);
  });
}

function calculateRM() {
  const weight = parseFloat(document.getElementById('rmWeight').value);
  const reps = parseInt(document.getElementById('rmReps').value);
  if (!weight || !reps || weight <= 0 || reps <= 0) { alert('Entre un poids et un nombre de reps valides.'); return; }

  const rm1 = weight / (1.0278 - 0.0278 * reps);
  const rm1r = roundToNearest(rm1, 0.5);
  const exerciseKey = document.getElementById('rmExercise').value;
  const exerciseLabel = RM_EXERCISES[exerciseKey].label;

  rmResult = { rm1: rm1r, weight, reps, exerciseKey, exerciseLabel, date: new Date().toLocaleDateString('fr-FR') };
  document.getElementById('rmEstimated').textContent = rm1r + ' kg';

  const zones = [
    { label: 'Échauffement',       pct: 0.50, repsRec: '15–20', color: '#6EE7B7' },
    { label: 'Endurance force',    pct: 0.60, repsRec: '15',    color: '#34D399' },
    { label: 'Hypertrophie légère',pct: 0.70, repsRec: '12–15', color: '#10B981' },
    { label: 'Hypertrophie',       pct: 0.75, repsRec: '10–12', color: '#059669' },
    { label: 'Force–Hypertrophie', pct: 0.80, repsRec: '8–10',  color: '#047857' },
    { label: 'Force',              pct: 0.85, repsRec: '6–8',   color: '#065F46' },
    { label: 'Force maximale',     pct: 0.90, repsRec: '4–6',   color: '#064E3B' },
  ];

  document.getElementById('rmZones').innerHTML = zones.map(z => {
    const kg = roundToNearest(rm1 * z.pct, 2.5);
    return `<div class="zone-row">
      <div class="zone-left"><span class="zone-dot" style="background:${z.color}"></span><span class="zone-label">${z.label}</span></div>
      <div class="zone-right"><span class="zone-kg">${kg} kg</span><span class="zone-reps">${z.repsRec} reps</span></div>
    </div>`;
  }).join('');

  const setsData = [
    { type: 'Séance intermédiaire', sets:'4', reps:'8–10', pct:0.78 },
    { type: 'Séance force',         sets:'5', reps:'6',    pct:0.85 },
  ];
  document.getElementById('rmSetsTable').innerHTML =
    `<p class="sets-table-title">Prescription — ${exerciseLabel}</p>` +
    setsData.map(s => {
      const kg = roundToNearest(rm1 * s.pct, 2.5);
      return `<div class="sets-row"><span class="sets-type">${s.type}</span><span class="sets-config">${s.sets} × ${s.reps} @ <strong>${kg} kg</strong></span></div>`;
    }).join('');

  document.getElementById('rmResult').style.display = 'block';
  document.getElementById('rmResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveRM() {
  if (!rmResult) return;
  const saved = getSavedRM();
  saved[rmResult.exerciseKey] = { rm1: rmResult.rm1, label: rmResult.exerciseLabel, date: rmResult.date, weight: rmResult.weight, reps: rmResult.reps };
  setSavedRM(saved);
  renderSavedRM();
  const btn = document.getElementById('saveBtnRM');
  btn.textContent = '✅ Sauvegardé !';
  setTimeout(() => {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Sauvegarder ces charges`;
  }, 2000);
}

function deleteRM(key) {
  const saved = getSavedRM(); delete saved[key]; setSavedRM(saved); renderSavedRM();
}

function renderSavedRM() {
  const saved = getSavedRM();
  const keys = Object.keys(saved);
  const section = document.getElementById('savedRmSection');
  if (keys.length === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  document.getElementById('savedRmList').innerHTML = keys.map(k => {
    const r = saved[k];
    return `<div class="saved-rm-card">
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
function roundToNearest(val, step) { return Math.round(val / step) * step; }

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  document.getElementById('headerDate').textContent = formatDate();
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  // Close log modal on backdrop click
  document.addEventListener('click', e => {
    const modal = document.getElementById('logModal');
    if (modal && e.target === modal) closeLogModal();
  });
  renderToday();
});
