const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

let score = 0;
let startTime;
let timeLimit = 60;
let timerInterval;

function updateScore() {
  scoreElement.innerText = `Score: ${score}`;
}

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      characterSpan.classList.remove("correct", "incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct && arrayValue.length === arrayQuote.length) {
    score++;
    updateScore();
    renderNewQuote();
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerText = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    const timeElapsed = Math.floor((new Date() - startTime) / 1000);
    timerElement.innerText = `Time: ${timeElapsed}s`;

    if (timeElapsed >= timeLimit) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  quoteInputElement.disabled = true;
  alert(`Time's up! Your final score is: ${score}`);

  score = 0;
  updateScore();
  quoteInputElement.disabled = false;
  startGame();
}

function startGame() {
  renderNewQuote();
  startTimer();
}

startGame();
