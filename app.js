// Misión Ahorro — app.js
// Persistencia keys
const STORAGE_KEY_STATE = 'misionAhorro_state';
const STORAGE_KEY_HISTORY = 'misionAhorro_history';

// Constants
const BUDGET = 200.0;
const GOAL_DAYS = 7;
const CHILDREN = ['simon', 'mateo', 'violeta'];

// DOM
const tabGasto = document.getElementById('tab-gasto');
const tabDias = document.getElementById('tab-dias');
const tabHist = document.getElementById('tab-historial');

const panelGasto = document.getElementById('panel-gasto');
const panelDias = document.getElementById('panel-dias');
const panelHist = document.getElementById('panel-historial');

const inputSpent = document.getElementById('input-spent');
const remainingLabel = document.getElementById('remaining-label');
const progressFill = document.getElementById('progress-fill');

const daysDecrease = document.getElementById('days-decrease');
const daysIncrease = document.getElementById('days-increase');
const daysValue = document.getElementById('days-value');
const calendarGrid = document.getElementById('calendar-grid');

const amountSimon = document.getElementById('amount-simon');
const amountMateo = document.getElementById('amount-mateo');
const amountVioleta = document.getElementById('amount-violeta');

const potTotal = document.getElementById('pot-total');
const perChild = document.getElementById('per-child');

const closeWeekBtn = document.getElementById('close-week');
const resetBtn = document.getElementById('reset');

const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// State
let state = {
  spent: 0.0,
  days: 0
};
let history = [];

// Utilities
function saveState(){
  localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
}
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY_STATE);
  if(raw) {
    try {
      const parsed = JSON.parse(raw);
      if(typeof parsed.spent === 'number' && typeof parsed.days === 'number'){
        state = parsed;
      }
    } catch(e){}
  }
}
function saveHistory(){
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
}
function loadHistory(){
  const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
  if(raw){
    try {
      history = JSON.parse(raw) || [];
    } catch(e) { history = []; }
  }
}

// Business logic
function computePrize(spent, days){
  // Cálculo 1: Ahorro Compra
  const leftover = Math.max(0, BUDGET - spent);
  const buyPrize = leftover * 0.10;

  // Cálculo 2: Ahorro Tiempo
  const extraDays = Math.max(0, days - GOAL_DAYS);
  const theoreticalPerDay = BUDGET / GOAL_DAYS; //≈28.5714
  const timePrize = extraDays * (theoreticalPerDay * 0.10);

  const totalPot = roundMoney(buyPrize + timePrize);
  const perKid = roundMoney(totalPot / 3);

  return {
    buyPrize: roundMoney(buyPrize),
    timePrize: roundMoney(timePrize),
    totalPot,
    perKid,
    leftover,
    extraDays,
    theoreticalPerDay
  };
}

function roundMoney(v){
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

// UI render functions
function renderAll(){
  // inputs
  inputSpent.value = state.spent === 0 ? '' : state.spent;

  // budget visual
  const spent = Math.max(0, state.spent || 0);
  const percent = Math.min(100, (spent / BUDGET) * 100);
  progressFill.style.width = `${percent}%`;

  const remaining = roundMoney(Math.max(0, BUDGET - spent));
  remainingLabel.textContent = `Restante: ${remaining.toFixed(2)}€`;

  // days
  daysValue.textContent = state.days;
  renderCalendar(state.days);

  // computation
  const result = computePrize(spent, state.days);
  potTotal.textContent = `${result.totalPot.toFixed(2)}€`;
  perChild.textContent = `${result.perKid.toFixed(2)}€ / niño`;

  // per child updates
  amountSimon.textContent = `${result.perKid.toFixed(2)}€`;
  amountMateo.textContent = `${result.perKid.toFixed(2)}€`;
  amountVioleta.textContent = `${result.perKid.toFixed(2)}€`;

  saveState();
  renderHistory();
}

function renderCalendar(days){
  calendarGrid.innerHTML = '';
  const daysCount = Math.max(0, Math.floor(days));
  // first 7 boxes
  for(let i=1;i<=GOAL_DAYS;i++){
    const div = document.createElement('div');
    div.classList.add('day');
    div.textContent = i;
    if(i <= daysCount){
      div.classList.add('active');
    }
    calendarGrid.appendChild(div);
  }
  // extras
  if(daysCount > GOAL_DAYS){
    const extra = daysCount - GOAL_DAYS;
    for(let j=1;j<=extra;j++){
      const div = document.createElement('div');
      div.classList.add('day','extra');
      div.textContent = `${GOAL_DAYS + j}`;
      calendarGrid.appendChild(div);
    }
  }
}

// History UI
function renderHistory(){
  historyList.innerHTML = '';
  if(history.length === 0){
    const li = document.createElement('li');
    li.classList.add('history-item');
    li.textContent = 'No hay semanas guardadas todavía.';
    historyList.appendChild(li);
    return;
  }
  history.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.classList.add('history-item');

    const left = document.createElement('div');
    left.classList.add('meta');
    const d = new Date(item.closedAt);
    left.innerHTML = `<strong>${d.toLocaleString()}</strong><br>
      Gasto: ${item.spent.toFixed(2)}€ · Días: ${item.days}`;

    const right = document.createElement('div');
    right.style.textAlign = 'right';
    right.innerHTML = `<div style="font-weight:800">${item.totalPot.toFixed(2)}€</div>
      <div class="muted">por niño: ${item.perKid.toFixed(2)}€</div>`;

    li.appendChild(left);
    li.appendChild(right);
    historyList.appendChild(li);
  });
}

// Events
inputSpent.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  state.spent = isNaN(v) ? 0 : Math.max(0, v);
  renderAll();
});

daysDecrease.addEventListener('click', () => {
  state.days = Math.max(0, state.days - 1);
  renderAll();
});
daysIncrease.addEventListener('click', () => {
  state.days = state.days + 1;
  renderAll();
});

// Tabs
tabGasto.addEventListener('click', () => switchTab('gasto'));
tabDias.addEventListener('click', () => switchTab('dias'));
tabHist.addEventListener('click', () => switchTab('historial'));

function switchTab(tab){
  tabGasto.classList.remove('active');
  tabDias.classList.remove('active');
  tabHist.classList.remove('active');
  panelGasto.classList.add('hidden');
  panelDias.classList.add('hidden');
  panelHist.classList.add('hidden');

  if(tab === 'gasto'){
    tabGasto.classList.add('active');
    panelGasto.classList.remove('hidden');
  } else if(tab === 'dias'){
    tabDias.classList.add('active');
    panelDias.classList.remove('hidden');
  } else {
    tabHist.classList.add('active');
    panelHist.classList.remove('hidden');
  }
}

// Close week
closeWeekBtn.addEventListener('click', () => {
  const result = computePrize(state.spent, state.days);
  const entry = {
    closedAt: new Date().toISOString(),
    spent: state.spent,
    days: state.days,
    buyPrize: result.buyPrize,
    timePrize: result.timePrize,
    totalPot: result.totalPot,
    perKid: result.perKid
  };
  history.push(entry);
  saveHistory();
  // Reset state
  state.spent = 0;
  state.days = 0;
  renderAll();
  // go to historial to view
  switchTab('historial');
});

// Reset without saving
resetBtn.addEventListener('click', () => {
  state.spent = 0;
  state.days = 0;
  renderAll();
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  if(confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) {
    history = [];
    saveHistory();
    renderHistory();
  }
});

// Initialization
function init(){
  loadState();
  loadHistory();
  // ensure shape
  state.spent = typeof state.spent === 'number' ? state.spent : 0;
  state.days = typeof state.days === 'number' ? state.days : 0;
  renderAll();
}

// run
init();
