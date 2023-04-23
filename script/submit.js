var summary = document.getElementById("summary");
var playerName = document.getElementById("playerName");
var submit = document.getElementById("submit");
var noSubmit = document.getElementById("noSubmit");

const d = new Date();
const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
var score = localStorage.getItem("score");
var record = [];

if (localStorage.getItem("record")) {
  record = JSON.parse(localStorage.getItem("record")).slice();
}

summary.textContent = `Your score is ${score}. Please submit your score.`;
submit.disabled = false;
submit.addEventListener("click", submitData);
noSubmit.addEventListener("click", () => {
  location.href = "scoreboard.html";
});

function submitData() {
  submit.disabled = true;

  var name = "Guest";

  if (playerName.value) {
    name = playerName.value;
  }

  var individualRecord = {
    name: name,
    score: score,
    date: date,
  };

  record.push(individualRecord);
  localStorage.setItem("record", JSON.stringify(record));

  location.href = "scoreboard.html";
}
