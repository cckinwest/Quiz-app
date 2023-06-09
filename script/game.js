var text = document.getElementById("text");
var timer = document.getElementById("timer");
var scoreboard = document.getElementById("scoreboard");
var highestScore = document.getElementById("highestScore");

var MCQOptions = document.getElementsByClassName("option");
var results = document.getElementsByClassName("result");

const questions = JSON.parse(localStorage.getItem("questions")).slice();

function shuffle(arr) {
  //shuffle the options so that the answer is not always D
  var new_arr = [];
  var original_len = arr.length;

  while (true) {
    var index = Math.floor(Math.random() * arr.length);
    new_arr.push(arr[index]);
    if (new_arr.length === original_len) {
      return new_arr;
    }
    var before = arr.slice(0, index);
    var after = arr.slice(index + 1, arr.length);
    arr = before.concat(after);
  }
}

function convertMCQ(question) {
  //convert the question object to have options A, B, C, D
  var options = question.incorrect.concat(question.correct);
  var correctKey = "";

  options = shuffle(options).slice();

  const mcOptions = {
    A: options[0],
    B: options[1],
    C: options[2],
    D: options[3],
  };

  //Find the correct answer
  for (var key in mcOptions) {
    if (mcOptions[key] === question.correct) {
      correctKey = key;
      break;
    }
  }

  return {
    text: question.text,
    options: mcOptions,
    correct: correctKey,
  };
}

//display the question on the question card which consists of 4 buttons
function render(question) {
  for (var i = 0; i < results.length; i++) {
    results[i].textContent = "";
  }

  var mcq = convertMCQ(question);

  text.textContent = mcq.text;

  for (var i = 0; i < MCQOptions.length; i++) {
    MCQOptions[i].textContent = Object.values(mcq.options)[i];
    MCQOptions[i].disabled = false; //when all the options are loaded, enabled the buttons
  }

  return mcq;
}

//disable all the buttons in some circumstances
function disableAll() {
  for (var i = 0; i < MCQOptions.length; i++) {
    MCQOptions[i].disabled = true;
  }
}

var index = 0;
var timeLeft = 45;
var score = 0;
var highest = 0;

if (localStorage.getItem("highest")) {
  highest = localStorage.getItem("highest"); //if there is record of highest, load it
}

//actions performed when the quiz ends
function gameOver() {
  disableAll();

  localStorage.setItem("score", score);

  if (score > localStorage.getItem("highest")) {
    localStorage.setItem("highest", score);
  }

  const myTimeout = setTimeout(() => {
    location.href = "submit.html";
  }, 2000);
}

timer.textContent = `Time Left: ${timeLeft}s`;
scoreboard.textContent = `Score: ${score}`;
highestScore.textContent = `Highest: ${highest}`;

//set the timer to count every second (1000 ms)
const myTimer = setInterval(() => {
  if (timeLeft > 0) {
    timer.textContent = `Time Left: ${timeLeft}s`;
    timeLeft--;
  } else {
    timer.textContent = `Time is up!`;
    clearInterval(myTimer);
    gameOver(); //the game ends when time is up
  }
}, 1000);

//render the first question
var currentQuestion = render(questions[index]);

//set the action of each button
for (var i = 0; i < MCQOptions.length; i++) {
  MCQOptions[i].addEventListener("click", (event) => {
    disableAll();

    var answer = event.target.id;
    var correctness = document.querySelector(`#${answer} + span`);
    const last = questions.length - 1;

    if (answer === currentQuestion.correct) {
      score++; //when the answer is correct
      timeLeft += 2;
      correctness.textContent = "✔";
    } else {
      score--; //when the answer is incorrect
      timeLeft -= 5;
      correctness.textContent = "✖";
    }

    scoreboard.textContent = `Score: ${score}`; //update the score when the correctness is determined

    if (index < last) {
      //when it's not last question, display the next
      index++;
      const myTimeout = setTimeout(() => {
        currentQuestion = render(questions[index]);
      }, 500);
    } else {
      gameOver(); //the game ends when all the questions have done.
    }
  });
}
