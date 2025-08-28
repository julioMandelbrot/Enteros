const setupContainer = document.getElementById("setup-container");
const problemContainer = document.getElementById("problem-container");
const summaryContainer = document.getElementById("summary-container");

const numProblemsInput = document.getElementById("num-problems");
const addSubBtn = document.getElementById("add-sub-btn");
const multDivBtn = document.getElementById("mult-div-btn");
const allBtn = document.getElementById("all-btn");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");

const problemText = document.getElementById("problem");
const timerText = document.getElementById("timer");
const answerInput = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const counterText = document.getElementById("counter");
const summaryText = document.getElementById("summary-text");

let totalProblems = 0;
let currentProblem = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let operationType = null;
let correctAnswer = 0;

let startTime = 0;
let timerInterval = null;

function formatProblem(a, op, b) {
  let problemStr = `${a} ${op} ${b}`;
  if (b < 0) {
    problemStr = `${a} ${op} (${b})`;
  }
  return problemStr;
}

function generateProblem() {
  let a, b, ops;
  let op;

  const numRange = 21; // Números entre -10 y 10 para sumas/restas
  const multDivRange = 11; // Números entre -5 y 5 para multiplicaciones/divisiones
  const largeNumRange = 25; // Números entre -12 y 12 para popurrí (más variedad)

  if (operationType === "add-sub") {
    a = Math.floor(Math.random() * numRange) - 10;
    b = Math.floor(Math.random() * numRange) - 10;
    ops = ["+", "-"];
    op = ops[Math.floor(Math.random() * ops.length)];
    correctAnswer = a + (op === "-" ? -b : b); // Para manejar correctamente la resta
  } else if (operationType === "mult-div") {
    let nonZeroA = Math.floor(Math.random() * multDivRange) - 5;
    if (nonZeroA === 0) nonZeroA = 1; // Evitar multiplicaciones por 0 triviales al inicio
    let nonZeroB = Math.floor(Math.random() * multDivRange) - 5;
    if (nonZeroB === 0) nonZeroB = 1; // Evitar divisiones por 0

    if (Math.random() < 0.5) { // 50% de probabilidad de multiplicación
      a = nonZeroA;
      b = nonZeroB;
      op = "*";
      correctAnswer = a * b;
    } else { // 50% de probabilidad de división
      // Garantizar una división exacta
      let result = Math.floor(Math.random() * multDivRange) - 5;
      if (result === 0) result = 1; // Evitar resultados de división 0 triviales
      let dividend = nonZeroB * result;
      a = dividend;
      b = nonZeroB;
      op = "/";
      correctAnswer = result;
    }
  } else if (operationType === "all") {
    ops = ["+", "-", "*", "/"];
    op = ops[Math.floor(Math.random() * ops.length)];

    let aVal, bVal;

    if (op === "+" || op === "-") {
      aVal = Math.floor(Math.random() * largeNumRange) - 12;
      bVal = Math.floor(Math.random() * largeNumRange) - 12;
      correctAnswer = aVal + (op === "-" ? -bVal : bVal);
    } else if (op === "*") {
      aVal = Math.floor(Math.random() * (multDivRange * 2)) - 10; // Rango un poco más amplio
      bVal = Math.floor(Math.random() * (multDivRange * 2)) - 10;
      correctAnswer = aVal * bVal;
    } else if (op === "/") {
      let nonZeroB = Math.floor(Math.random() * (multDivRange * 2)) - 10;
      if (nonZeroB === 0) nonZeroB = 1;
      let result = Math.floor(Math.random() * (multDivRange * 2)) - 10;
      if (result === 0) result = 1;
      aVal = nonZeroB * result;
      bVal = nonZeroB;
      correctAnswer = result;
    }
    
    a = aVal;
    b = bVal;
  }

  problemText.textContent = formatProblem(a, op, b);
  feedback.textContent = "";
  answerInput.value = "";
  answerInput.focus();
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  timerText.textContent = `Tiempo: ${elapsedTime}s`;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function showSummary() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  summaryText.innerHTML = `
    Partidas jugadas: ${totalProblems} <br>
    Aciertos: ${correctAnswers} <br>
    Fallos: ${incorrectAnswers} <br>
    Tiempo transcurrido: ${elapsedTime}s
  `;
  problemContainer.classList.add("hidden");
  summaryContainer.classList.remove("hidden");
}

function startGame(opType) {
  totalProblems = Number(numProblemsInput.value);
  if (totalProblems < 1 || isNaN(totalProblems)) {
    alert("Por favor, ingresa un número de operaciones válido (mayor que 0).");
    return;
  }
  operationType = opType;
  currentProblem = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;

  setupContainer.classList.add("hidden");
  problemContainer.classList.remove("hidden");
  
  startTimer();
  nextProblem();
}

function nextProblem() {
  currentProblem++;
  if (currentProblem <= totalProblems) {
    counterText.textContent = `${currentProblem}/${totalProblems}`;
    generateProblem();
  } else {
    stopTimer();
    showSummary();
  }
}

function checkAnswer() {
  // Manejar el caso de que el input esté vacío o no sea un número válido
  if (answerInput.value.trim() === "" || isNaN(Number(answerInput.value))) {
    feedback.textContent = "¡Ingresa un número válido!";
    feedback.style.color = "orange";
    answerInput.focus();
    return;
  }

  const userAnswer = Number(answerInput.value);
  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correcto";
    feedback.style.color = "green";
    correctAnswers++;
  } else {
    feedback.textContent = `❌ Incorrecto. La respuesta era ${correctAnswer}`;
    feedback.style.color = "red";
    incorrectAnswers++;
  }
  setTimeout(nextProblem, 3000);
}

// Event Listeners
addSubBtn.addEventListener("click", () => startGame("add-sub"));
multDivBtn.addEventListener("click", () => startGame("mult-div"));
allBtn.addEventListener("click", () => startGame("all"));
submitBtn.addEventListener("click", checkAnswer);
restartBtn.addEventListener("click", () => {
  summaryContainer.classList.add("hidden");
  setupContainer.classList.remove("hidden");
  timerText.textContent = "Tiempo: 0s";
});

// Registrar el service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      console.log('SW registrado: ', registration);
    }).catch(registrationError => {
      console.log('Error de registro SW: ', registrationError);
    });
  });
}