var summary = document.getElementById("summary");
var playerName = document.getElementById("playerName");
var submit = document.getElementById("submit");
var noSubmit = document.getElementById("noSubmit");

const d = new Date();
const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
var score = localStorage.getItem("score");
var record = [];

if (localStorage.getItem("record")) {
  //when there are previous records, load them
  record = JSON.parse(localStorage.getItem("record")).slice();
}

summary.textContent = `Your score is ${score}. Please submit your score.`;
submit.disabled = false;
submit.addEventListener("click", submitData);
noSubmit.addEventListener("click", () => {
  //click this button to go straight to the final page without saving
  location.href = "scoreboard.html";
});

function submitData() {
  submit.disabled = true;

  var name = "Guest";

  if (playerName.value) {
    name = playerName.value;
  }

  //create the individual record when submit
  var individualRecord = {
    name: name,
    score: score,
    date: date,
  };

  record.push(individualRecord); //act the individual record
  localStorage.setItem("record", JSON.stringify(record));

  location.href = "scoreboard.html";
}
