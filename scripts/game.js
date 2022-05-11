/**
 * Word Arrays to be used
 */
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
  "broad",
  "depth",
  "fixed",
  "panel",
  "quack",
  "rural",
  "seven",
  "thief",
  "unity"
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

/**
 * Redirects to index.html if game settings are not loaded
 */
function redirect() {
  if (Object.keys(localStorage).length == 0) {
    alert("Game settings not loaded! Redirecting you to homepage");
    location.href = "../index.html";
    return false;
  }
  return true;
}

/**
 * "Dummy" function used to trigger the onbeforeunload event when pressing the navigation buttons
 */
function warn() {
  return confirm("");
}

/**
 * Adds the user-entered word bank to the custom list
 * @param { String } str - a string representing the textarea value of the word bank
 */
function loadCustomList(str) {
  //Splits the gathered text by a space pattern
  let listArray = str.split(/(\s+)/);
  let outputArray = []
  //Removes space characters from the wordArray
  for (let i = 0; i < listArray.length; i++) {
    if (listArray[i].includes(" "))
      listArray.splice(i, 1);
  }
  //Pushes each word to the output array
  for (let i = 0; i < listArray.length; i++) {
    if (listArray[i] == '') continue; //Note: see line 116 of index.js for this issue
    outputArray.push(listArray[i]);
  }

  return outputArray;
}

/**
 * Loads the appropriate game settings
 */
function game() {
  let rightWord, rightWordList;
  //Sets the default word bank/list
  switch (Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"])) {
    case 4: rightWordList = FOUR_LETTER_WORDS; break;
    case 5: rightWordList = FIVE_LETTER_WORDS; break;
    case 6: rightWordList = SIX_LETTER_WORDS; break;
    case 7: rightWordList = SEVEN_LETTER_WORDS; break;
  }
  //Concatenates the user-entered and default word banks/lists
  rightWordList = rightWordList.concat(loadCustomList(JSON.parse([localStorage.getItem("settings")])["wordPool"]));
  //Randomizes the correct word
  rightWord = rightWordList[Math.floor(Math.random() * rightWordList.length)];
  //Sets the game 'variables'
  sessionStorage.setItem("attempt", "");                    //Contains the last attempted word
  sessionStorage.setItem("attemptCount", JSON.parse(1));    //Contains the number of attempts
  sessionStorage.setItem("position", JSON.parse(1));        //Contains the current position of the user
  sessionStorage.setItem("rightWord", rightWord);           //Contains the correct word
  sessionStorage.setItem("isFinished", JSON.parse(false));  //Contains the boolean the determines if the game is finished
  //Generates the grid
  generateGrid();
}

/**
 * Generates the playing grid
 */
function generateGrid() {
  //Variables that determine its size
  let maxRows = JSON.parse(localStorage.getItem("settings"))["maxAttempts"];
  let maxCols = JSON.parse(localStorage.getItem("settings"))["wordLength"];
  //Nested loop to insert each cell and row
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

/**
 * Adds a letter on the grid
 */
function addLetter(btn) {
  let position = Number.parseInt(JSON.parse(sessionStorage.getItem("position")));
  let wordLength = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"]);
  let isFinished = JSON.parse(sessionStorage.getItem("isFinished"));
  //User cannot type after the game is finished
  if (isFinished) return;
  //If the position exceeds wordLength, then no event will happen
  if (position <= wordLength) {
    let attempt = sessionStorage.getItem("attempt");
    let attemptCount = Number.parseInt(JSON.parse(sessionStorage.getItem("attemptCount")));
    let cell = document.getElementById(`l${attemptCount}${position}`);
    //Enters the letter from the button clicked
    cell.innerHTML = btn.innerHTML;
    //Increments position
    sessionStorage.setItem("position", JSON.parse((position + 1)));
    //Adds char to the end of the attempted word string
    sessionStorage.setItem("attempt", (attempt += cell.innerHTML));
  }
}

/**
 * Removes a letter on the grid
 */
function popLetter() {
  let attempt = sessionStorage.getItem("attempt");
  let attemptCount = Number.parseInt(JSON.parse(sessionStorage.getItem("attemptCount")));
  let position = Number.parseInt(JSON.parse(sessionStorage.getItem("position")));
  let isFinished = JSON.parse(sessionStorage.getItem("isFinished"));
  //User cannot remove letter if there's no letter on the row or the game is finished
  if (position == 1 || isFinished) return;
  //Removes the letter content of the cell
  let cell = document.getElementById(`l${attemptCount}${(position - 1)}`);
  cell.innerHTML = "";
  //Decrements position
  sessionStorage.setItem("position", JSON.parse((position - 1)));
  //Remove char from the end of the attempted word string
  sessionStorage.setItem("attempt", attempt.slice(0, -1));
}

/**
 * Validates attempted word
 */
function validateAttempt() {
  let isFinished = JSON.parse(sessionStorage.getItem("isFinished"));
  let wordLength = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["wordLength"]);
  let position = Number.parseInt(JSON.parse(sessionStorage.getItem("position")));
  let attempt = sessionStorage.getItem("attempt");
  let attemptCount = Number.parseInt(JSON.parse(sessionStorage.getItem("attemptCount")));
  let maxAttempts = Number.parseInt(JSON.parse(localStorage.getItem("settings"))["maxAttempts"]);
  let rightWord = sessionStorage.getItem("rightWord").toUpperCase();
  let hintsDisabled = JSON.parse(localStorage.getItem("settings"))["hints"];
  //Does not validate attempt when game is finished
  if (isFinished) return
  //Alerts user if they still have missing letters
  if (position != wordLength + 1) {
    alert(`Please type ${ wordLength + 1 - position } more letter/s`);
    return;
  }
  //Loop checks each char
  for (let i = 0; i < wordLength; i++) {
    let attemptChar = attempt[i];
    let rightChar = rightWord[i];
    let element = document.getElementById(`l${attemptCount}${i + 1}`);
    //If char is correct and in the correct position
    if (attemptChar == rightChar)
      element.style.backgroundColor = "var(--guess-right-place)";
    //If char is correct and in the wrong position (may be disabled by the user)
    else if (rightWord.includes(attemptChar) && !hintsDisabled)
      element.style.backgroundColor = "var(--guess-wrong-place)";
    //If char is not found on the word
    else
      element.style.backgroundColor = "var(--guess-wasted)";
    //Miscellaneous CSS
    element.style.fontWeight = "bold";
    element.style.color = "var(--guess-text-color)";
  }
  //Event when user guesses the right word
  if (attempt == rightWord) {
    sessionStorage.setItem("isFinished", JSON.parse(true));
    // this will be used in the finished_js file
    localStorage.setItem("attempts_taken", attemptCount);
    localStorage.setItem("attempts_possible", maxAttempts);
    // redirect to the next page
    window.location.href = "../htdocs/finished.html";
    return;
  }

  if (attemptCount + 1 <= maxAttempts) { //when user still has spare attempts
    sessionStorage.setItem("attempt", "");                                  //Reset attempted word
    sessionStorage.setItem("attemptCount", JSON.parse(attemptCount + 1));   //Increments attemptCount
    sessionStorage.setItem("position", JSON.parse(1));                      //Reset position back to 1
  } else {  //when user has no more attempts
    sessionStorage.setItem("isFinished", JSON.parse(true));
  }
}