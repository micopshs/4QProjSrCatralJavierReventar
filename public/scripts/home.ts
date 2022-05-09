// stuff

import globalSettings from "./globals.js";

/**
 * Toggles the visibility of a dialog element
 * with the object itself passed in.
 * @param target the object itself. Use window.id to call.
 */
function toggleVisibility(target: HTMLDialogElement) {
  if (!target.open) {
    target.showModal();
    document.body.style.background = "rgba(0, 0, 0, 0.7)";
  } else {
    target.close();
    document.body.style.background = "";
  }
}

/**
 * Toggles the visibility of a selected form input element.
 * @param target The Form input element itself. Use window.id to call.
 */
function disableInput(target: HTMLInputElement) {
  target.disabled = !target.disabled;
}

/**
 * Sets the bounds for the max_attempt_input element using information gathered
 * from the word_length_input element: namely, that twice the word length
 * inputted should be exactly equal to the maximum element. It will also affect
 * the spans with ids "minBound" and "maxBound", even though
 * it does not take those elements as inputs.
 *
 * This function is not pure.
 * @param word_length_input The form input element containing the length of the word.
 * @param max_attempt_input The form input element containing the max attempt. Note:
 * this element will be manipulated, unlike the previous one, which is const.
 */
function setMaxAttemptBounds(
  word_length_input: HTMLInputElement,
  max_attempt_input: HTMLInputElement
) {
  var min = Number(word_length_input.value);
  var max = 2 * min;
  // Change input field attr
  max_attempt_input.min = min.toString();
  max_attempt_input.max = max.toString();
  // Change display
  document.getElementById("minBound").textContent = min.toString();
  document.getElementById("maxBound").textContent = max.toString();
}

const validateWordBank = (input_bank : string, word_length : number) => {
  let lettersPattern = /^[a-zA-Z]+$/;
  let spacesPattern = /(\s+)/;
  let wordArray = input_bank.split(spacesPattern);

  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i].includes(" ")) wordArray.splice(i, 1);
  }

  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] == "") continue;
    if (!lettersPattern.test(wordArray[i])) {
      alert(
        `Sorry, but words like ${wordArray[i]} are not valid since they contain characters that are not letters`
      );
      return false;
    }
    if (wordArray[i].length != word_length) {
      alert(`${wordArray[i]} is not a ${word_length}-letter word`);
      return false;
    }
  }

  return true;
};

/**
 * Saves the settings to the global settings object upon submission of the form.
 * @param form The form element itself. Pass in as "this".
 * @returns false.
 */
function saveSettings(form: HTMLFormElement) {
  // preserve settings in the global
  globalSettings.setSettings(new FormData(form));

  // validate the word bank
  const word_bank = form.querySelector("textarea").value;
  if (!validateWordBank(word_bank, globalSettings.wordLength)) {
    return false;
  }

  // store the 2 colors in the necessary variables
  document.documentElement.style.setProperty(
    "--guess-right-place",
    globalSettings.correctColor
  );
  document.documentElement.style.setProperty(
    "--guess-wrong-place",
    globalSettings.hintColor
  );

  // success: make the modal disappear
  toggleVisibility(document.querySelector("#settingsDialog"));
  return false;
}

window.addEventListener("load", function () {
  // set up all the stuff
  const settings_dialog = document.getElementById(
    "settingsDialog"
  ) as HTMLDialogElement;
  const mechanics_dialog = document.getElementById(
    "mechanics"
  ) as HTMLDialogElement;

  document.querySelector("#settingsForm").addEventListener("submit", function () {
    return saveSettings(this);
  });
  document.querySelector("#wordLength").addEventListener("change", function () {
    setMaxAttemptBounds(this, document.querySelector("#maxAttempts"));
  });
  document.querySelector("#hints").addEventListener("change", () => {
    disableInput(document.querySelector("#hintColor"));
  })

  let btns = document.querySelectorAll("main > button");
  btns[0].addEventListener("click", () => {
    toggleVisibility(mechanics_dialog);
  });
  btns[1].addEventListener("click", () => {
    toggleVisibility(settings_dialog);
  });
  btns[2].addEventListener("click", () => {
    location.href = "/html/game.html";
  });
  btns[3].addEventListener("click", () => {
    location.href = "/html/finished.html";
  });
  document
    .querySelector("#mechanics > button")
    .addEventListener("click", () => {
      toggleVisibility(mechanics_dialog);
    });
});
