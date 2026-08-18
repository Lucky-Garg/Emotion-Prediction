const EMOTION_EMOJIS = {
  sadness: '😢',
  joy: '😄',
  love: '❤️',
  anger: '😠',
  fear: '😨',
  surprise: '😲'
};

const EMOTION_COLORS = {
  sadness: '#5B8DEF',
  joy: '#F6C445',
  love: '#F1618C',
  anger: '#F0563F',
  fear: '#9B6BF2',
  surprise: '#3FD1C5'
};

const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const predictBtn = document.getElementById('predictBtn');
const btnLabel = document.getElementById('btnLabel');
const btnIcon = document.getElementById('btnIcon');
const errorMsg = document.getElementById('errorMsg');

const resultEmpty = document.getElementById('resultEmpty');
const resultContent = document.getElementById('resultContent');
const emojiBadge = document.getElementById('emojiBadge');
const emotionName = document.getElementById('emotionName');
const echoText = document.getElementById('echoText');
const confidenceValue = document.getElementById('confidenceValue');
const ringProgress = document.getElementById('ringProgress');
const probList = document.getElementById('probList');

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

const RING_CIRCUMFERENCE = 188.5;

// ---------- character counter ----------
textInput.addEventListener('input', () => {
  charCount.textContent = `${textInput.value.length} / 2000`;
});

// ---------- example chips ----------
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    textInput.value = chip.dataset.text;
    charCount.textContent = `${textInput.value.length} / 2000`;
    textInput.focus();
  });
});

// ---------- health check ----------
async function checkHealth(){
  try{
    const res = await fetch('/health');
    if(!res.ok) throw new Error('bad status');
    const data = await res.json();
    if(data.model_loaded){
      statusDot.className = 'dot online';
      statusText.textContent = 'Model ready';
    } else {
      statusDot.className = 'dot offline';
      statusText.textContent = 'Model loading…';
      setTimeout(checkHealth, 3000);
    }
  }catch(e){
    statusDot.className = 'dot offline';
    statusText.textContent = 'Server unreachable';
  }
}
checkHealth();

// ---------- predict ----------
predictBtn.addEventListener('click', runPrediction);
textInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && (e.metaKey || e.ctrlKey)){
    runPrediction();
  }
});

async function runPrediction(){
  const text = textInput.value.trim();
  errorMsg.style.display = 'none';

  if(!text){
    errorMsg.textContent = 'Type a sentence first.';
    errorMsg.style.display = 'block';
    return;
  }

  setLoading(true);

  try{
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if(!res.ok){
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.detail || `Request failed (${res.status})`);
    }

    const data = await res.json();
    renderResult(data);
  }catch(e){
    errorMsg.textContent = e.message || 'Something went wrong. Try again.';
    errorMsg.style.display = 'block';
  }finally{
    setLoading(false);
  }
}

function setLoading(isLoading){
  predictBtn.disabled = isLoading;
  predictBtn.classList.toggle('loading', isLoading);
  btnLabel.textContent = isLoading ? 'Analyzing' : 'Analyze';
  btnIcon.innerHTML = isLoading
    ? '<circle cx="12" cy="12" r="9" stroke-dasharray="42" stroke-dashoffset="14"/>'
    : '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>';
}

function renderResult(data){
  const emotion = data.predicted_emotion;

  // swap ambient theme to match the detected emotion
  document.body.className = `mood-${emotion}`;

  resultEmpty.style.display = 'none';
  resultContent.style.display = 'block';

  emojiBadge.textContent = EMOTION_EMOJIS[emotion] || '🙂';
  // restart the pop animation
  emojiBadge.style.animation = 'none';
  void emojiBadge.offsetWidth;
  emojiBadge.style.animation = '';

  emotionName.textContent = emotion;
  echoText.textContent = `“${data.text}”`;

  const pct = Math.round(data.confidence * 100);
  confidenceValue.textContent = `${pct}%`;
  const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * pct / 100);
  // reset then animate
  ringProgress.style.transition = 'none';
  ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
  void ringProgress.offsetWidth;
  ringProgress.style.transition = '';
  requestAnimationFrame(() => {
    ringProgress.style.strokeDashoffset = offset;
  });

  // sort probabilities descending
  const sorted = Object.entries(data.all_probabilites || data.all_probabilities || {})
    .sort((a, b) => b[1] - a[1]);

  probList.innerHTML = '';
  sorted.forEach(([label, prob]) => {
    const rowPct = Math.round(prob * 100);
    const row = document.createElement('div');
    row.className = 'prob-row' + (label === emotion ? ' is-top' : '');
    row.innerHTML = `
      <span class="prob-name">${EMOTION_EMOJIS[label] || ''} ${label}</span>
      <div class="prob-track"><div class="prob-fill" style="--bar-color:${EMOTION_COLORS[label] || '#8B7CF6'}"></div></div>
      <span class="prob-pct">${rowPct}%</span>
    `;
    probList.appendChild(row);
    requestAnimationFrame(() => {
      row.querySelector('.prob-fill').style.width = `${rowPct}%`;
    });
  });
}
