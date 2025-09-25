// ===== scriptmioalejandro.js =====
// Laberinto visible, más difícil, preguntas cada 10s sin repetición hasta agotar.

// ===== DOM =====
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timeSpan = document.getElementById('time');
const scoreSpan = document.getElementById('score');

const qModal = document.getElementById('questionModal');
const qTitle = document.getElementById('qTitle');
const qOptions = document.getElementById('qOptions');

const overlay = document.getElementById('resultOverlay');
const overlayCard = document.getElementById('overlayCard');
const overlayTitle = document.getElementById('resultTitle');
const overlayText = document.getElementById('resultText');

// ===== MAP (string rows) - más ancho y con más detalle =====
const MAP = [
  "########################################",
  "#S   #    #      #     #      #        #",
  "# ## # ## # #### # ### # #### # ### ##E#",
  "#    #  # #    # #   # #    # #   #   ##",
  "#### ### #### # ### # ### ##     # ### #",
  "#    #    #   #     #   #  #   # #     #",
  "# ####### ####### #### ### #### # ######",
  "#      #                #         #    #",
  "# #### # ## # #### ####### ## # #### # #",
  "# #    #    #    #       #  # #    # # #",
  "# # ###### # #### ###### # ## #### # # #",
  "# #        #    #      # #    #    # # #",
  "# ######## #### # #### # ###### #### # #",
  "#        #    # #    # #      #      # #",
  "######## # ## # #### # ###### # ###### #",
  "#      # #  # #      #      # #      # #",
  "# #### # #### ######## #### # #### # # #",
  "#    # #      #      #    # #      #   #",
  "########################################"
];

// ===== grid sizes computed from MAP and canvas container =====
const ROWS = MAP.length;
const COLS = MAP[0].length;
const CELL = Math.floor(Math.min(880 / COLS, 560 / ROWS)); // visual cell size
canvas.width = CELL * COLS;
canvas.height = CELL * ROWS;

// ===== game state =====
let player = { x:0, y:0 }; // grid coords
let startPos = { x:0, y:0 };
let goalPos = { x:0, y:0 };

let running = false;
let asking = false;
let score = 0;
let timeLeft = 120;
let gameTimerId = null;
let questionIntervalId = null;

const QUESTION_INTERVAL = 10000; // 10s

// ===== QUESTIONS pool (25+ on mantenimiento preventivo) =====
const QUESTIONS = [
  { q:"¿Cuál es el objetivo del mantenimiento preventivo?", opts:["Reparar después de fallar","Prevenir fallas y reducir paradas","Ignorar anomalías","Aumentar consumo"], a:1 },
  { q:"¿Qué documento define las tareas y frecuencias?", opts:["Plan de mantenimiento","Factura","Contrato","Manual de usuario"], a:0 },
  { q:"Antes de intervenir, es obligatorio:", opts:["Dejarlo en marcha","Desenergizar y bloquear","Saltar la protección","Pintarlo"], a:1 },
  { q:"¿Qué revisamos en lubricación?", opts:["Nivel y tipo de lubricante","Color de carcasa","Longitud del cable","Tamaño del gestor"], a:0 },
  { q:"Filtro muy sucio suele causar:", opts:["Mejor rendimiento","Obstrucción y sobrecalentamiento","Menos ruido","Más vida útil"], a:1 },
  { q:"Instrumento para medir corriente/voltaje:", opts:["Martillo","Multímetro","Llave de impacto","Cúter"], a:1 },
  { q:"Registro que se completa tras la tarea:", opts:["Bitácora/informe","Publicidad","Correo","Foto"], a:0 },
  { q:"Buena práctica tras mantenimiento:", opts:["No informar","Documentar y etiquetar","Ocultar fallas","Desconectar todo"], a:1 },
  { q:"¿Qué controla el torque correcto?", opts:["Llave dinamométrica","Martillo","Destornillador común","Cinta métrica"], a:0 },
  { q:"¿Con qué frecuencia revisarías un equipo crítico?", opts:["Aleatorio","Según plan y horas de operación","Nunca","Solo en vacaciones"], a:1 },
  { q:"Al limpiar equipo eléctrico, primero:", opts:["Echar agua","Apagar y desconectar","Desarmar sin seguridad","Pintar"], a:1 },
  { q:"¿Qué ayuda a detectar fallas tempranas?", opts:["Inspecciones rutinarias","Esperar a que falle","Ignorar sonidos","Apagar sensores"], a:0 },
  { q:"Mantenimiento predictivo usa:", opts:["Suerte","Condiciones y datos","Solo calendario","Nada"], a:1 },
  { q:"Orden de trabajo sirve para:", opts:["Registrar tareas y responsables","Sacar fotos","Encender equipos","Pintar"], a:0 },
  { q:"¿Qué registra una bitácora?", opts:["Tareas, fecha y técnico","Precio del equipo","Número de serie","Firma del jefe"], a:0 },
  { q:"Rodamientos requieren:", opts:["Lubricación adecuada","Pintura constante","Voltaje estable","Nunca mantenimiento"], a:0 },
  { q:"¿Qué causa sobrecalentamiento?", opts:["Ventilación obstruida","Buena lubricación","Correcto ajuste","Documentación correcta"], a:0 },
  { q:"La seguridad incluye:", opts:["Uso de EPP","Ignorar etiquetas","Trabajar apresurado","Olvidar herramientas"], a:0 },
  { q:"¿Qué tipo reacciona a fallos?", opts:["Preventivo","Predictivo","Correctivo","Proactivo"], a:2 },
  { q:"Calibración sirve para:", opts:["Asegurar mediciones","Aumentar ruido","Romper equipo","Pintar"], a:0 },
  { q:"Un plan de mantenimiento debe ser:", opts:["Aleatorio","Documentado y programado","Secreto","No necesario"], a:1 },
  { q:"Inspección rápida y frecuente:", opts:["Visual","Desarme total","Cambio de piezas","Formateo"], a:0 },
  { q:"Antes de ajustes mecánicos revisar:", opts:["Torque y seguridad","Color del equipo","Precio","Manual"], a:0 },
  { q:"Filtro obstruido afecta:", opts:["Rendimiento y temperatura","Apariencia","No afecta","Reduce peso"], a:0 },
  { q:"Indicador de falla temprana:", opts:["Ruidos inusuales","Que todo esté perfecto","Pintura nueva","Etiqueta presente"], a:0 },
  { q:"Documentar cambios ayuda a:", opts:["Mejorar historial","Ocultar errores","Aumentar dudas","Nadie"], a:0 },
  { q:"¿Qué es EPP?", opts:["Equipo de Protección Personal","Equipo de Presión Permanente","Error de Protocolo","Elemento de Pánico"], a:0 },
  { q:"Medición de vibraciones sirve para:", opts:["Detectar desbalance","Aumentar ruido","Romper máquina","Nada"], a:0 }
];

// ===== question pool shuffle (no repetición hasta agotar) =====
let questionPool = [];
function refillQuestionPool(){
  questionPool = QUESTIONS.slice();
  for(let i = questionPool.length -1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [questionPool[i], questionPool[j]] = [questionPool[j], questionPool[i]];
  }
}
refillQuestionPool();

// ===== helpers map =====
function chAt(x,y){
  if(y < 0 || y >= ROWS || x < 0 || x >= COLS) return '#';
  return MAP[y][x];
}
function findStartGoal(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const ch = chAt(c,r);
      if(ch === 'S'){ player.x = c; player.y = r; startPos = {x:c,y:r}; }
      if(ch === 'E' || ch === 'G'){ goalPos = {x:c,y:c}; goalPos = {x:c,y:r}; }
    }
  }
}

// ===== draw =====
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // background cells
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const ch = chAt(c,r);
      const x = c*CELL, y = r*CELL;
      if(ch === '#'){
        ctx.fillStyle = '#0b1220'; // wall
        ctx.fillRect(x,y,CELL,CELL);
      } else {
        ctx.fillStyle = '#f8fcff'; // floor
        ctx.fillRect(x,y,CELL,CELL);
      }
      ctx.strokeStyle = 'rgba(6,30,60,0.04)';
      ctx.strokeRect(x,y,CELL,CELL);
    }
  }

  // draw goal
  if(goalPos){
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(goalPos.x*CELL + 6, goalPos.y*CELL + 6, CELL-12, CELL-12);
  }

  // draw player as circle
  const px = player.x*CELL + CELL/2;
  const py = player.y*CELL + CELL/2;
  ctx.beginPath();
  ctx.fillStyle = '#0ea5ff';
  ctx.arc(px,py, Math.max(8, CELL*0.32), 0, Math.PI*2);
  ctx.fill();
  ctx.closePath();
}

function flashCell(cx, cy){
  const x = cx*CELL, y = cy*CELL;
  ctx.save();
  ctx.fillStyle = 'rgba(255,80,80,0.25)';
  ctx.fillRect(x,y,CELL,CELL);
  setTimeout(()=> { draw(); }, 120);
  ctx.restore();
}

// ===== timers & question scheduler =====
function startTimers(){
  clearInterval(gameTimerId);
  clearInterval(questionIntervalId);

  timeLeft = 120;
  timeSpan.textContent = timeLeft;

  gameTimerId = setInterval(()=>{
    if(!running) return;
    timeLeft--;
    timeSpan.textContent = timeLeft;
    if(timeLeft <= 0){
      endGame(false, "⏱️ Se acabó el tiempo. Perdiste.");
    }
  }, 1000);

  questionIntervalId = setInterval(()=>{
    if(!running) return;
    if(asking) return;
    // avoid asking when at start or at goal
    if(player.x === startPos.x && player.y === startPos.y) return;
    if(goalPos && player.x === goalPos.x && player.y === goalPos.y) return;
    presentQuestion();
  }, QUESTION_INTERVAL);
}

// ===== present question =====
function presentQuestion(){
  if(questionPool.length === 0) refillQuestionPool();
  const qObj = questionPool.pop();
  if(!qObj) return;

  asking = true;
  running = false;

  qTitle.textContent = qObj.q;
  qOptions.innerHTML = '';
  qObj.opts.forEach((opt, idx) => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.addEventListener('click', ()=> {
      qModal.classList.add('hidden');
      if(idx === qObj.a){
        score++;
        scoreSpanUpdate();
        asking = false;
        running = true;
      } else {
        endGame(false, "❌ Respuesta incorrecta. Has perdido.");
      }
    });
    qOptions.appendChild(b);
  });

  qModal.classList.remove('hidden');
  qModal.setAttribute('aria-hidden','false');
}

// ===== score update =====
function scoreSpanUpdate(){
  const el = document.getElementById('score');
  if(el) el.textContent = score;
}

// ===== movement =====
function canMoveTo(nx, ny){
  return chAt(nx, ny) !== '#';
}
function tryMove(dx, dy){
  if(!running || asking) return;
  const nx = player.x + dx, ny = player.y + dy;

  // allow reaching goal
  if(goalPos && nx === goalPos.x && ny === goalPos.y){
    player.x = nx; player.y = ny;
    draw();
    endGame(true, `🏆 ¡Ganaste! Aciertos: ${score}`);
    return;
  }

  if(canMoveTo(nx, ny)){
    player.x = nx; player.y = ny;
    draw();
  } else {
    flashCell(nx, ny);
  }
}

// ===== end game & overlay =====
function showOverlay(win, title, text){
  overlay.classList.remove('hidden');
  overlayCard.classList.toggle('win', win);
  overlayCard.classList.toggle('lose', !win);
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  setTimeout(()=> {
    overlay.classList.add('hidden');
    resetGame();
  }, 1600);
}

function endGame(win, message){
  running = false;
  asking = false;
  clearInterval(gameTimerId);
  clearInterval(questionIntervalId);
  if(win){
    showOverlay(true, '🎉 ¡Ganaste!', message || 'Llegaste a la meta.');
  } else {
    showOverlay(false, '💥 Perdiste', message || 'Inténtalo de nuevo.');
  }
}

// ===== input handling =====
function onKey(e){
  if(!running) return;
  const k = e.key;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)){
    e.preventDefault();
    if(k === 'ArrowUp') tryMove(0,-1);
    if(k === 'ArrowDown') tryMove(0,1);
    if(k === 'ArrowLeft') tryMove(-1,0);
    if(k === 'ArrowRight') tryMove(1,0);
  }
}

// ===== start / reset =====
function startGame(){
  // find start and goal
  findStartGoal();
  refillQuestionPool();
  score = 0;
  scoreSpanUpdate();
  running = true;
  asking = false;
  startBtn.disabled = true;
  restartBtn.disabled = false;
  timeLeft = 120;
  timeSpan.textContent = timeLeft;
  draw();
  startTimers();
  document.addEventListener('keydown', onKey);
}

function resetGame(){
  clearInterval(gameTimerId);
  clearInterval(questionIntervalId);
  startBtn.disabled = false;
  restartBtn.disabled = true;
  running = false;
  asking = false;
  score = 0;
  scoreSpanUpdate();
  findStartGoal();
  player.x = startPos.x; player.y = startPos.y;
  timeLeft = 120;
  timeSpan.textContent = timeLeft;
  draw();
  document.removeEventListener('keydown', onKey);
}

// ===== init =====
findStartGoal();
resetGame();
draw();

// ===== hooks =====
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);

// ensure score span exists
(function ensureScoreSpan(){
  let s = document.getElementById('score');
  if(!s){
    const hud = document.querySelector('.hud');
    if(hud){
      s = document.createElement('span');
      s.id = 'score';
      s.textContent = '0';
      hud.appendChild(s);
    }
  }
})();
