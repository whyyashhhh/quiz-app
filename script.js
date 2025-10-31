const questionElement = document.getElementById("question");
const answerList = document.getElementById("answer-list");
const nextButton = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const timerDisplay = document.getElementById("timer");
const questionContainer = document.getElementById("question-container");
const highScoreDisplay = document.getElementById("high-score");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let highScore = localStorage.getItem("highScore") || 0;

// Load high score
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Fetch questions from JSON
fetch("question.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    startQuiz();
  })
  .catch(() => {
    alert("Failed to load questions.");
  });

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();

  const currentQuestion = questions[currentQuestionIndex];
  progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionElement.innerText = currentQuestion.question;

  // Create answer buttons dynamically
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    button.addEventListener("click", () => selectAnswer(answer));
    answerList.appendChild(button);
  });

  // Start countdown
  startTimer();
}

function resetState() {
  nextButton.style.display = "none";
  answerList.innerHTML = "";
  clearInterval(timer);
  timerDisplay.textContent = 10;
  timeLeft = 10;
}

function selectAnswer(answer) {
  clearInterval(timer);
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => {
    const isCorrect = questions[currentQuestionIndex].answers.find(
      (a) => a.text === btn.innerText
    ).correct;
    btn.classList.add(isCorrect ? "correct" : "incorrect");
    btn.disabled = true;
  });
  if (answer.correct) score++;
  nextButton.style.display = "block";
}

function startTimer() {
  timeLeft = 10;
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      // auto-lock question
      autoSelect();
    }
  }, 1000);
}

function autoSelect() {
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => {
    const isCorrect = questions[currentQuestionIndex].answers.find(
      (a) => a.text === btn.innerText
    ).correct;
    btn.classList.add(isCorrect ? "correct" : "incorrect");
    btn.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  clearInterval(timer);
  questionElement.innerText = `You scored ${score} out of ${questions.length}! 🎉`;
  answerList.innerHTML = "";
  progressText.innerText = "Quiz Finished!";
  nextButton.innerText = "Play Again";
  nextButton.style.display = "block";

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
}

function handleNextButton() {
  questionContainer.classList.add("fade-out");
  setTimeout(() => {
    questionContainer.classList.remove("fade-out");

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }, 300);
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});
