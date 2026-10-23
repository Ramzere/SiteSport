// ============================================================
//  FITPRO v4.3 — App Logic
//  © 2025 RémiRodriguez
//  + Timer de repos automatique
//  + Compteur de séries avec chrono
// ============================================================

// ---------- STATE ----------
let currentPage = 'today';
let currentDayIdx = getTodayIdx();

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
function getTheme() { return localStorage.getItem(sk('theme')) || 'dark'; }
function setThemeSt(t) { localStorage.setItem(sk('theme'), t); }

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
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
  if (s.includes('enchaîner') || /\b0\s*sec/.test(s)) return 0;
  // "X min Y sec" / "X min Y"
  const minSec = s.match(/(\d+)\s*min(?:utes?)?\s*(\d+)/);
  if (minSec) return parseInt(minSec[1]) * 60 + parseInt(minSec[2]);
  // "X-Y min" → take the lower bound
  const rangMin = s.match(/(\d+)-\d+\s*min/);
  if (rangMin) return parseInt(rangMin[1]) * 60;
  // "X min"
  const minOnly = s.match(/(\d+)\s*min/);
  if (minOnly) return parseInt(minOnly[1]) * 60;
  // "X sec"
  const secOnly = s.match(/(\d+)\s*sec/);
  if (secOnly) return parseInt(secOnly[1]);
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

function renderToday() {
  const dayData = PROGRAM[currentDayIdx];
  const checked = getChecked(currentDayIdx);

  document.getElementById('dayBadge').textContent = dayData.label.toUpperCase();
  document.getElementById('dayTitle').textContent = dayData.typeLabel;
  document.getElementById('daySubtitle').textContent = dayData.title;
  document.getElementById('dayDuration').textContent = dayData.duration;
  document.getElementById('dayHero').style.setProperty('--day-color', dayData.color);

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

  const pct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;
  document.getElementById('progressPill').textContent = pct + '% complété';
  document.getElementById('progressFill').style.width = pct + '%';
  if (pct === 100 && totalEx > 0) showCelebration();
}

// ── TOAST / CELEBRATION ──────────────────────────────────────
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



// ---------- UTILS ----------
function roundToNearest(val, step) { return Math.round(val / step) * step; }

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  document.getElementById('headerDate').textContent = formatDate();
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  renderToday();
});
