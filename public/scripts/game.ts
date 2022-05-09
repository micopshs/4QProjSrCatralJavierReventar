const FOUR_LETTER_WORDS = [
  "boss",
  "cast",
  "drew",
  "fish",
  "grey",
  "hang",
  "knee",
  "next",
  "plug",
  "rich"
];

const FIVE_LETTER_WORDS = [
  "amber",
  //"broad",
  //"depth",
  //"fixed",
  //"panel",
  //"quack",
  //"rural",
  //"seven",
  //"thief",
  //"unity"
];

const SIX_LETTER_WORDS = [
  "behalf",
  "custom",
  "driver",
  "income",
  "hidden",
  "module",
  "permit",
  "robust",
  "twelve",
  "wright"
];

const SEVEN_LETTER_WORDS = [
  "anxiety",
  "barrier",
  "diverse",
  "eastern",
  "million",
  "overall",
  "primary",
  "require",
  "succeed",
  "weather"
];

function redirect() {
  if (Object.keys(localStorage).length == 0) {
    alert("Game settings not loaded! Redirecting you to homepage");
    location.href = "../index.html";
    return false;
  }
  return true;
}

function warn() {
  return confirm("Are you sure you want to leave this page?\nAll progress will be reset once you do so");
}


function loadCustomList(str) {
  let listArray = str.split(/(\s+)/);
  let outputArray = []

  for (let i = 0; i < listArray.length; i++) {
    if (listArray[i].includes(" ")) 
      listArray.splice(i, 1);
  }

  for (let i = 0; i < listArray.length; i++) {
    if (listArray[i] == '') continue;
    outputArray.push(listArray[i]);
  }

  return outputArray;
}

function game() {
  let rightWord, rightWordList;

  switch (Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"])) {
    case 4: rightWordList = FOUR_LETTER_WORDS; break;
    case 5: rightWordList = FIVE_LETTER_WORDS; break;
    case 6: rightWordList = SIX_LETTER_WORDS; break;
    case 7: rightWordList = SEVEN_LETTER_WORDS; break;
  }

 rightWordList = rightWordList.concat(loadCustomList(JSON.parse([localStorage.getItem("settings")])["wordPool"]));
  rightWord = rightWordList[Math.floor(Math.random() * rightWordList.length)];
  
  localStorage.setItem("attempt", "");
  localStorage.setItem("attemptCount", JSON.parse(1));
  localStorage.setItem("position", JSON.parse(1));
  localStorage.setItem("rightWord", rightWord);
  localStorage.setItem("isFinished", JSON.parse(false));
  
  generateGrid();
}

function generateGrid() {
  let maxRows = JSON.parse(localStorage.getItem("settings"))["maxAttempts"];
  let maxCols = JSON.parse(localStorage.getItem("settings"))["wordLength"];
  
  //if (!maxRows) maxRows = 1;
  
  for (let i = 1; i <= maxRows; i++) {
    let row = document.createElement("div");
    row.id = `l${i}0`;
    row.classList.add("play-grid-row");
    for (let j = 1; j <= maxCols; j++) {
      let col = document.createElement("div");
      col.id = `l${i}${j}`;
      col.classList.add("play-grid-cell");
      row.appendChild(col);
    }
    playingGrid.appendChild(row);
  }
}

function addLetter(btn) {
  let position = Number.parseInt(JSON.parse(localStorage.getItem("position")));
  let wordLength = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"]);
  let isFinished = JSON.parse(localStorage.getItem("isFinished"));

  if (isFinished) return;
  
  if (position <= wordLength) {
    let attempt = localStorage.getItem("attempt");
    let attemptCount = Number.parseInt(JSON.parse(localStorage.getItem("attemptCount")));
    let cell = document.getElementById(`l${attemptCount}${position}`);
    
    cell.innerHTML = btn.innerHTML;
    localStorage.setItem("position", JSON.parse((position + 1)));
    localStorage.setItem("attempt", (attempt += cell.innerHTML));
  }
}

function popLetter() {
  let attempt = localStorage.getItem("attempt");
  let attemptCount = Number.parseInt(JSON.parse(localStorage.getItem("attemptCount")));
  let position = Number.parseInt(JSON.parse(localStorage.getItem("position")));
  let isFinished = JSON.parse(localStorage.getItem("isFinished"));
  
  if (position == 1 || isFinished) return;
  
  let cell = document.getElementById(`l${attemptCount}${(position - 1)}`);
  cell.innerHTML = "";
  localStorage.setItem("position", JSON.parse((position - 1)));
  localStorage.setItem("attempt", attempt.slice(0, -1));
} 

function validateAttempt() {
  let isFinished = JSON.parse(localStorage.getItem("isFinished")); 
  let wordLength = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"]);
  let position = Number.parseInt(JSON.parse(localStorage.getItem("position")));
  let attempt = localStorage.getItem("attempt");
  let attemptCount = Number.parseInt(JSON.parse(localStorage.getItem("attemptCount")));
  let maxAttempts = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["maxAttempts"]);
  let rightWord = localStorage.getItem("rightWord").toUpperCase();

  if (isFinished) return

  if (position != wordLength + 1) {
    alert(`Please type ${ wordLength + 1 - position } more letter/s`);
    return;
  }

  console.log(`Attempt ${attemptCount}`)

  for (let i = 0; i < wordLength; i++) {
    let attemptChar = attempt[i];
    let rightChar = rightWord[i];
    let element = document.getElementById(`l${attemptCount}${i + 1}`);

    if (attemptChar == rightChar) 
      element.style.backgroundColor = "var(--guess-right-place)";
    else if (rightWord.includes(attemptChar)) 
      element.style.backgroundColor = "var(--guess-wrong-place)";
    else 
      element.style.backgroundColor = "var(--guess-wasted)";

    element.style.fontWeight = "bold";
    element.style.color = "var(--guess-text-color)";
  }

  if (attempt == rightWord) {
    console.log("Congrats");
    localStorage.setItem("isFinished", JSON.parse(true));

    // this will be used in the finished_js file
    localStorage.setItem("attempts_taken", attemptCount);
    localStorage.setItem("attempts_possible", maxAttempts);
    // redirect to the next page
    window.location.href = "../htdocs/finished.html";
    return;
  } 

  if (attemptCount + 1 <= maxAttempts) {
    localStorage.setItem("attempt", "");
    localStorage.setItem("attemptCount", JSON.parse(attemptCount + 1));
    localStorage.setItem("position", JSON.parse(1));
  } else {
    console.log("You noob");
    localStorage.setItem("isFinished", JSON.parse(true));
  }
}