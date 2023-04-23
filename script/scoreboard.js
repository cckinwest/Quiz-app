var resultsTable = document.getElementById("resultsTable");
var clear = document.getElementById("clear");
var back = document.getElementById("back");

clear.addEventListener("click", clearRecord);
back.addEventListener("click", () => {
  location.href = "index.html"; //link back to the start page
});

var record = [];

if (localStorage.getItem("record")) {
  //if there are previous records, load them
  record = JSON.parse(localStorage.getItem("record")).slice();
}

//create a new row for each record
for (var i = 0; i < record.length; i++) {
  resultsTable.innerHTML += `<tr><td>${record[i].name}</td><td>${record[i].score}</td><td>${record[i].date}</td></tr>`;
}

function clearRecord() {
  localStorage.removeItem("record");
  localStorage.removeItem("highest");
  //initialize when all the records are cleared
  resultsTable.innerHTML = "<tr><th>Name</th><th>Score</th><th>Date</th></tr>";
}
