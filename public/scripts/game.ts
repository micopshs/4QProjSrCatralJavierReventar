// stuff

import globalSettings from "./globals.js";

// quasi-"main" function
const load_page_data = async () => {
  // 1. Check if settings have been set.
  if (globalSettings.isEmpty()) {
    alert("Game settings not loaded! Redirecting you to homepage");
    console.log("test2");
    window.history.back();
  }

  // 2. Figure out the right word.
  let rightWord = "";

  if (!globalSettings.useWordPool) {
    let response = await fetch(`/api/randomWord/${globalSettings.wordLength}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 200) {
      alert("No word found.");
    }
    let response_json: object = await response.json();
    console.log(JSON.stringify(response_json));
    rightWord = response_json["word"].toUpperCase();
  } else {
    rightWord =
      globalSettings.wordPool[
        Math.floor(Math.random() * globalSettings.wordPool.length)
      ].toUpperCase();
  }

  console.log(rightWord);

  // 3. Prepare local variables.
  sessionStorage.setItem("attempt", "");
  sessionStorage.setItem("attemptCount", String(1));
  sessionStorage.setItem("position", String(1));
  sessionStorage.setItem("rightWord", rightWord);
  sessionStorage.setItem("isFinished", String(false));

  // 4. Create the grid upon which the wordle will begin.
  let maxRows = globalSettings.maxAttempts;
  let maxCols = globalSettings.wordLength;
  let playingGrid = document.getElementById("playingGrid");

  for (let i = 1; i <= maxRows; i++) {
    // Create a "row" element as a div
    let row = document.createElement("div");
    row.id = `l${i}0`;
    row.classList.add("play-grid-row");

    // create all the square elements in that row
    for (let j = 1; j <= maxCols; j++) {
      let col = document.createElement("div");
      col.id = `l${i}${j}`;
      col.classList.add("play-grid-cell");
      row.appendChild(col);
    }
    playingGrid.appendChild(row);
  }

  // 5. Initialize all the buttons.
  // 5a. Initialize the keyboard buttons.
  const button_arr = document.getElementsByClassName(
    "letterButton"
  ) as HTMLCollectionOf<HTMLButtonElement>;
  for (const element of button_arr) {
    element.addEventListener("click", function () {
      addLetter(this);
    });
  }

  // 5b. Initialize the buttons on the side of the keyboard.
  document.getElementById("enter").addEventListener("click", () => {
    validateAttempt();
  });

  document.getElementById("remove").addEventListener("click", () => {
    popLetter();
  });

  // 5c. Initialize the buttons to go backwards and forwards.
  document.getElementById("next").addEventListener("click", () => {
    if (warn()) {
      window.location.href = "/html/finished.html";
    }
  });

  document.getElementById("back").addEventListener("click", () => {
    if (warn()) {
      window.location.href = "/html/home.html";
    }
  });
};

function warn() {
  return confirm(
    "Are you sure you want to leave this page?\nAll progress will be reset once you do so"
  );
}

function addLetter(btn: HTMLButtonElement) {
  const position = Number(sessionStorage.getItem("position"));
  const wordLength = globalSettings.wordLength;
  if (position > wordLength) return;

  const isFinished = sessionStorage.getItem("isFinished") === "true";
  if (isFinished) return;

  let attempt = sessionStorage.getItem("attempt");
  const attemptCount = Number(sessionStorage.getItem("attemptCount"));
  let cell = document.getElementById(`l${attemptCount}${position}`);

  cell.textContent = btn.textContent;
  sessionStorage.setItem("position", String(position + 1));
  sessionStorage.setItem("attempt", (attempt += cell.textContent));
}

function popLetter() {
  const position = Number(sessionStorage.getItem("position"));
  if (position === 1) return;

  const isFinished = sessionStorage.getItem("isFinished") === "true";
  if (isFinished) return;

  let attempt = sessionStorage.getItem("attempt");
  const attemptCount = Number(sessionStorage.getItem("attemptCount"));
  let cell = document.getElementById(`l${attemptCount}${position - 1}`);

  cell.textContent = "";
  sessionStorage.setItem("position", String(position - 1));
  sessionStorage.setItem("attempt", attempt.slice(0, -1));
}

function validateAttempt() {
  // check if the game is finished
  const isFinished = sessionStorage.getItem("isFinished") === "true";
  if (isFinished) return;

  // check if word is complete
  const wordLength = globalSettings.wordLength;
  const position = Number(sessionStorage.getItem("position"));
  if (position != wordLength + 1) {
    alert(`Please type ${wordLength + 1 - position} more letter/s`);
    return;
  }

  const attempt = sessionStorage.getItem("attempt");
  const attemptCount = Number(sessionStorage.getItem("attemptCount"));
  const maxAttempts = globalSettings.maxAttempts;
  const correctWord = sessionStorage.getItem("rightWord").toUpperCase();
  console.log(`Attempt ${attemptCount}`);

  // confirm the correctness of each character
  let checkingWord = correctWord;
  for (let i = 0; i < wordLength; i++) {
    let attemptChar = attempt[i];
    let rightChar = checkingWord[i];
    let element = document.getElementById(`l${attemptCount}${i + 1}`);

    if (attemptChar == rightChar) {
      // remove the letter from the checking word so it wont accidentally
      // activate another yellow card
      checkingWord = checkingWord.replace(attemptChar, " ");
      
      element.classList.add("guess-right-place");
    } else if (checkingWord.includes(attemptChar)) {
      // remove the letter as well
      checkingWord = checkingWord.replace(attemptChar, " ");

      element.classList.add("guess-wrong-place");
    } else {
      element.classList.add("guess-wasted");
    }
  }

  // confirm the correctness of the entire word
  if (attempt === correctWord) {
    console.log("Congrats");
    sessionStorage.setItem("isFinished", String(true));

    // this will be used in the finished_js file
    localStorage.setItem("correct_word", correctWord);
    localStorage.setItem("attempts_taken", String(attemptCount));
    // redirect to the next page
    window.location.href = "/html/finished.html";
    return;
  }

  // check if there are still attempts left
  if (attemptCount + 1 <= maxAttempts) {
    sessionStorage.setItem("attempt", "");
    sessionStorage.setItem("attemptCount", String(attemptCount + 1));
    sessionStorage.setItem("position", String(1));
    return;
  }

  // no more attempts left. Redirect to new page with a zero score.
  console.log("You noob");
  localStorage.setItem("correct_word", correctWord);
  localStorage.setItem("attempts_taken", String(maxAttempts));
  sessionStorage.setItem("isFinished", String(true));
  // redirect to the next page
  window.location.href = "/html/finished.html";
}

window.addEventListener("load", load_page_data, false);
