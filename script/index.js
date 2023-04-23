var message = document.getElementById("message");
var start = document.getElementById("start");

start.addEventListener("click", startGame);

async function generateQuestions() {
  var questions = [];

  const url = new URL("https://the-trivia-api.com/v2/questions");
  //this url is the end point of an api to generate quiz questions.

  const params = new URLSearchParams({
    limit: 10,
    difficulties: "easy",
    types: "text_choice",
  });
  //params is the search criteria

  url.search = params;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  //use fetch api to get data

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

  generateQuestions().then((questions) => {
    clearInterval(myLoading);
    localStorage.setItem("questions", JSON.stringify(questions));
    location.href = "./pages/game.html";
  });
}
