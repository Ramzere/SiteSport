// ============================================================
//  FITPRO v5.0 — App Logic
//  © 2025 RémiRodriguez
//  Simplifié : cases + timer + poids mémo par exercice
// ============================================================

let currentPage = 'today';
let currentDayIdx = getTodayIdx();
const CIRCUMFERENCE = 2 * Math.PI * 52;
let timerInterval = null, timerTotal = 0, timerRemaining = 0, timerPaused = false;
let wakeLock = null;

function getTodayIdx() {
  const map = { 1:0, 2:1, 3:2, 4:3, 5:4 };
  const d = new Date().getDay();
  return map[d] !== undefined ? map[d] : 0;
}

// ── STORAGE ─────────────────────────────────────────────────
function sk(k) { return 'fitpro_' + k; }
function getChecked(d)    { try { return JSON.parse(localStorage.getItem(sk('chk_'+d))) || {}; } catch { return {}; } }
function setChecked(d, o) { localStorage.setItem(sk('chk_'+d), JSON.stringify(o)); }
function getWeights()     { try { return JSON.parse(localStorage.getItem(sk('weights'))) || {}; } catch { return {}; } }
function setWeights(o)    { localStorage.setItem(sk('weights'), JSON.stringify(o)); }
function getTheme()       { return localStorage.getItem(sk('theme')) || 'dark'; }
function setThemeSt(t)    { localStorage.setItem(sk('theme'), t); }

// ── THEME ───────────────────────────────────────────────────
function applyTheme(t) {
  document.body.classList.toggle('dark', t === 'dark');
  document.body.classList.toggle('light', t === 'light');
  const m = document.getElementById('themeColor');
  if (m) m.content = t === 'dark' ? '#0A0A0A' : '#F0F0EE';
}
function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next); setThemeSt(next);
}

// ── NAV ─────────────────────────────────────────────────────
function showPage(name) {
  currentPage = name;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelector('[data-page="'+name+'"]').classList.add('active');
  if (name === 'today') renderToday();
  if (name === 'week')  renderWeek();
}

function formatDate() {
  const d = new Date();
  const days   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()];
}

// ── TIMER ───────────────────────────────────────────────────
function parseRestSeconds(s) {
  if (!s) return 0;
  const t = s.toLowerCase();
  if (t.includes('3 min'))    return 180;
  if (t.includes('2-3 min') || t.includes('2-3mins')) return 150;
  if (t.includes('2 min'))    return 120;
  if (t.includes('1 min 30') || t.includes('1m30')) return 90;
  if (t.includes('45 sec'))   return 45;
  if (t.includes('30 sec'))   return 30;
  if (t.includes('20 sec'))   return 20;
  return 0;
}

function startTimer(sec, label) {
  if (sec <= 0) return;
  stopTimer();
  timerTotal = sec; timerRemaining = sec; timerPaused = false;
  document.getElementById('timerLabel').textContent = label || 'Repos';
  document.getElementById('timerNext').textContent = '';
  document.getElementById('timerPauseBtn').textContent = 'Pause';
  document.getElementById('timerOverlay').style.display = 'flex';
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (!timerPaused) {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining <= 0) { clearInterval(timerInterval); timerFinished(); }
    }
  }, 1000);
  requestWakeLock();
}

function updateTimerDisplay() {
  const m = Math.floor(timerRemaining / 60), s = timerRemaining % 60;
  document.getElementById('timerDisplay').textContent = m + ':' + String(s).padStart(2,'0');
  const pct = timerRemaining / timerTotal;
  const ring = document.getElementById('ringFill');
  if (ring) { ring.style.strokeDasharray = CIRCUMFERENCE; ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct); }
  document.querySelector('.timer-card')?.classList.toggle('timer-warning', timerRemaining <= 5 && timerRemaining > 0);
}

function timerFinished() {
  document.getElementById('timerOverlay').style.display = 'none';
  if (navigator.vibrate) navigator.vibrate([200,100,200]);
  releaseWakeLock();
}
function pauseTimer() { timerPaused = !timerPaused; document.getElementById('timerPauseBtn').textContent = timerPaused ? 'Reprendre' : 'Pause'; }
function skipTimer()  { stopTimer(); document.getElementById('timerOverlay').style.display = 'none'; releaseWakeLock(); }
function stopTimer()  { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } timerPaused = false; }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch {} }
function releaseWakeLock() { if (wakeLock) { wakeLock.release(); wakeLock = null; } }

// ── TODAY ───────────────────────────────────────────────────
function renderToday() {
  const day = PROGRAM[currentDayIdx];
  document.getElementById('dayBadge').textContent    = day.label.toUpperCase();
  document.getElementById('dayTitle').textContent    = day.typeLabel;
  document.getElementById('daySubtitle').textContent = day.title;
  document.getElementById('dayDuration').textContent = day.duration || '—';
  document.getElementById('dayHero').style.setProperty('--day-color', day.color);

  // Séance libre (Rugby / Course)
  if (day.freeSession) {
    document.getElementById('progressPill').textContent = '';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('sessionContent').innerHTML = `
      <div class="free-session-card">
        <span class="free-icon">${day.freeIcon}</span>
        <p class="free-msg">${day.freeMsg}</p>
        <p class="free-sub">Pas de programme — vas-y au feeling</p>
      </div>`;
    return;
  }

  const checked = getChecked(currentDayIdx);
  const weights = getWeights();
  let totalEx = 0, doneEx = 0, html = '';
  const allFlat = day.sections.flatMap(s => s.exercises);

  day.sections.forEach(sec => {
    html += `<div class="section-block">
      <div class="section-header"><span class="section-icon">${sec.icon}</span><span class="section-name">${sec.name}</span></div>`;

    sec.exercises.forEach(ex => {
      totalEx++;
      const isDone = !!checked[ex.id];
      if (isDone) doneEx++;
      const restSec  = parseRestSeconds(ex.rest);
      const flatIdx  = allFlat.findIndex(e => e.id === ex.id);
      const nextName = allFlat[flatIdx + 1]?.name || '';
      const savedW   = weights[ex.id] || '';

      // Champ poids uniquement si pas durée fixe
      const isDuration = !ex.sets.match(/×|x/i) && (ex.sets.includes('min') || ex.sets.includes('sec'));
      const weightField = !isDuration ? `
        <div class="weight-field-row">
          <input class="weight-input" type="number" inputmode="decimal" placeholder="kg" step="0.5"
            value="${savedW}"
            onchange="saveWeight('${ex.id}', this.value)"
            onclick="event.stopPropagation()"/>
          <span class="weight-unit">kg</span>
        </div>` : '';

      html += `
        <div class="exercise-item ${isDone ? 'done' : ''}" id="ex_${ex.id}">
          <button class="check-btn ${isDone ? 'checked' : ''}"
            onclick="toggleEx('${ex.id}',${currentDayIdx},${restSec},'${(ex.rest||'').replace(/'/g,"\\'")}','${nextName.replace(/'/g,"\\'")}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <div class="ex-body">
            <p class="ex-name">${ex.name}</p>
            <p class="ex-sets">${ex.sets}</p>
            ${ex.rest ? `<p class="ex-rest">⏱ ${ex.rest}</p>` : ''}
            ${ex.note ? `<p class="ex-note">${ex.note}</p>` : ''}
            ${ex.warn ? `<p class="ex-warn">⚠️ ${ex.warn}</p>` : ''}
            ${weightField}
          </div>
        </div>`;
    });
    html += `</div>`;
  });

  document.getElementById('sessionContent').innerHTML = html;
  const pct = totalEx > 0 ? Math.round(doneEx / totalEx * 100) : 0;
  document.getElementById('progressPill').textContent = pct + '% complété';
  document.getElementById('progressFill').style.width  = pct + '%';
  if (pct === 100 && totalEx > 0) showCelebration();
}

function toggleEx(exId, dayIdx, restSec, restLabel, nextName) {
  const checked = getChecked(dayIdx);
  const wasDone = !!checked[exId];
  checked[exId] = !wasDone;
  setChecked(dayIdx, checked);
  if (navigator.vibrate) navigator.vibrate(10);
  if (!wasDone && restSec > 0) startTimer(restSec, restLabel || 'Repos');
  renderToday();
}

function saveWeight(exId, val) {
  const w = getWeights();
  if (val) w[exId] = parseFloat(val);
  else delete w[exId];
  setWeights(w);
}

function resetDay() {
  if (!confirm('Réinitialiser la séance ?')) return;
  localStorage.removeItem(sk('chk_' + currentDayIdx));
  stopTimer();
  document.getElementById('timerOverlay').style.display = 'none';
  renderToday();
}

function showCelebration() {
  let c = document.getElementById('celebration');
  if (!c) {
    c = document.createElement('div');
    c.id = 'celebration'; c.className = 'celebration';
    c.innerHTML = '<div class="celeb-inner"><span class="celeb-emoji">🏆</span><p class="celeb-text">Séance terminée !</p><p class="celeb-sub">Excellent travail</p><button onclick="this.parentElement.parentElement.style.display=\'none\'">OK</button></div>';
    document.body.appendChild(c);
  }
  c.style.display = 'flex';
}

// ── WEEK ────────────────────────────────────────────────────
function renderWeek() {
  const today = getTodayIdx();
  document.getElementById('weekGrid').innerHTML = PROGRAM.map((day, i) => {
    const checked = getChecked(i);
    const allEx   = day.sections.flatMap(s => s.exercises);
    const done    = allEx.filter(e => checked[e.id]).length;
    const pct     = allEx.length > 0 ? Math.round(done / allEx.length * 100) : 0;
    const isToday = i === today;
    return `
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
        ${!day.freeSession ? `
        <div class="week-footer">
          <div class="week-progress-track">
            <div class="week-progress-fill" style="width:${pct}%;background:${day.color}"></div>
          </div>
          <span class="week-pct">${pct}%</span>
        </div>` : `<p class="week-free-label">${day.freeIcon} Libre</p>`}
      </div>`;
  }).join('');
}

function goToDay(idx) { currentDayIdx = idx; showPage('today'); }

// ── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  document.getElementById('headerDate').textContent = formatDate();
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  renderToday();
});
