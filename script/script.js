function shuffle(arr) {
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

async function generateQuestions() {
  var questions = [];

  const url = new URL("https://the-trivia-api.com/v2/questions");

  const params = new URLSearchParams({
    limit: 10,
    difficulties: "easy",
    types: "text_choice",
  });

  url.search = params;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  var data = await response.json();

  for (var i = 0; i < data.length; i++) {
    var question = {
      text: data[i].question.text,
      correct: data[i].correctAnswer,
      incorrect: data[i].incorrectAnswers,
    };

    questions.push(question);
  }

  return questions;
}

var score = 0;

var start = document.getElementById("start");
var qCard = document.getElementById("questionCard");
var headPanel = document.getElementById("headPanel");
var nameForm = document.getElementById("nameForm");
var resultsPanel = document.getElementById("resultsPanel");
var resultsTable = document.getElementById("resultsTable");
var clear = document.getElementById("clear");

var message = document.getElementById("message");
var text = document.getElementById("text");
var optionA = document.getElementById("A");
var optionB = document.getElementById("B");
var optionC = document.getElementById("C");
var optionD = document.getElementById("D");
var timer = document.getElementById("timer");
var scoreboard = document.getElementById("scoreboard");
var highest = document.getElementById("highest");

var summary = document.getElementById("summary");
var playerName = document.getElementById("playerName");
var submit = document.getElementById("submit");

var MCQOptions = document.getElementsByClassName("option");

headPanel.setAttribute("style", "display: none;");
qCard.setAttribute("style", "display: none;");
nameForm.setAttribute("style", "display: none;");
resultsPanel.setAttribute("style", "display: none;");

start.addEventListener("click", startGame);
submit.addEventListener("click", submitData);
clear.addEventListener("click", clearRecord);

function convertMCQ(question) {
  var options = question.incorrect.concat(question.correct);
  var correctKey = "";

  options = shuffle(options).slice();

  const mcOptions = {
    A: options[0],
    B: options[1],
    C: options[2],
    D: options[3],
  };

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

function render(question) {
  var results = document.getElementsByClassName("result");

  for (var i = 0; i < results.length; i++) {
    results[i].textContent = "";
  }

  var mcq = convertMCQ(question);

  text.textContent = mcq.text;
  optionA.textContent = mcq.options.A;
  optionB.textContent = mcq.options.B;
  optionC.textContent = mcq.options.C;
  optionD.textContent = mcq.options.D;

  for (var i = 0; i < MCQOptions.length; i++) {
    MCQOptions[i].disabled = false;
  }

  return mcq;
}

function startGame() {
  start.disabled = true;
  message.textContent = "Wait a second for the game to start";
  var count = 0;

  const myLoading = setInterval(() => {
    message.textContent += ".";
    count++;

    if (count === 5) {
      message.textContent = "Wait a second for the game to start";
      count = 0;
    }
  }, 200);

  var index = 0;
  var timeLeft = 30;
  var highestScore = 0;

  if (localStorage.getItem("highest")) {
    highestScore = localStorage.getItem("highest");
  }

  function gameOver() {
    for (var i = 0; i < MCQOptions.length; i++) {
      MCQOptions[i].disabled = true;
    }

    if (score > localStorage.getItem("highest")) {
      localStorage.setItem("highest", score);
    }

    const myTimeout = setTimeout(() => {
      headPanel.setAttribute("style", "display: none;");
      qCard.setAttribute("style", "display: none;");
      summary.textContent = `Your score is ${score}.`;
      nameForm.setAttribute("style", "display: block;");
    }, 2000);
  }

  generateQuestions().then((questions) => {
    clearInterval(myLoading);

    message.setAttribute("style", "display: none;");
    start.setAttribute("style", "display: none;");

    qCard.setAttribute("style", "display: block;");
    headPanel.setAttribute("style", "display: block;");
    timer.textContent = `Time (seconds): ${timeLeft}`;
    scoreboard.textContent = `Score: ${score}`;
    highest.textContent = `Highest Score: ${highestScore}`;

    var question = render(questions[index]);

    const myTimer = setInterval(() => {
      if (timeLeft > 0) {
        timer.textContent = `Time (seconds): ${timeLeft}`;
        timeLeft--;
      } else {
        timer.textContent = `Time is up!`;
        gameOver();
        clearInterval(myTimer);
      }
    }, 1000);

    for (var i = 0; i < MCQOptions.length; i++) {
      MCQOptions[i].addEventListener("click", (event) => {
        for (var i = 0; i < MCQOptions.length; i++) {
          MCQOptions[i].disabled = true;
        }

        var answer = event.target.id;
        var result = document.querySelector(`#${answer} + span`);

        if (answer === question.correct) {
          result.textContent = "✔";
          score++;
          timeLeft += 1;
        } else {
          result.textContent = "✖";
          score--;
          timeLeft -= 3;
        }

        scoreboard.textContent = `Score: ${score}`;

        if (index < questions.length - 1) {
          index++;
          const myTimeout = setTimeout(() => {
            question = render(questions[index]);
          }, 500);
        } else {
          gameOver();
        }
      });
    }
  });
}

function submitData() {
  var record = [];
  var name = "";
  const d = new Date();
  const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  if (localStorage.getItem("record")) {
    record = JSON.parse(localStorage.getItem("record")).slice();
  }

  if (playerName.value) {
    name = playerName.value;
  } else {
    name = "guest";
  }

  var individual = {
    name: name,
    score: score,
    date: date,
  };

  record.push(individual);
  localStorage.setItem("record", JSON.stringify(record));

  for (var i = 0; i < record.length; i++) {
    resultsTable.innerHTML += `<tr><th>${record[i].name}</th><th>${record[i].score}</th><th>${record[i].date}</th></tr>`;
  }

  nameForm.setAttribute("style", "display: none;");
  resultsPanel.setAttribute("style", "display: block;");
}

function clearRecord() {
  localStorage.removeItem("record");
  resultsTable.innerHTML = "<tr><th>Name</th><th>Score</th><th>Date</th></tr>";
}
