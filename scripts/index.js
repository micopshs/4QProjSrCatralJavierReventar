/**
 * Saves settings if nothing is stored in localStorage upon loading
 */
function loadDefault() {
  if (Object.keys(localStorage).length == 0) saveSettings(settingsForm);
}

/**
 * Alerts the user by displaying a red border if input does not follow constraints.
 * @param { HTMLInputElement } input - the target input element
 */
function validateInput(input) {
  let condition = (
    Number.parseInt(input.value) <= input.max && //value should be less than or equal to the maximum
    Number.parseInt(input.value) >= input.min && //value should be greater than or equal to the minimum
    input.value % 1 == 0                         //value should have no decimals
  );
  input.style.border = condition ? "2px solid green" : "2px solid red";
}

/**
 * Switches the visibilibity of a dialog element
 * @param { HTMLDialogElement } target - the target dialog element
 */
function toggleVisibility(target) {
  target.open = !(target.open)
  //Darkens the background when disabled to avoid user distraction
  if (target.open) document.body.style.background = "rgba(0, 0, 0, 0.7)";
  else document.body.style.background = "";
}

/**
 * Allows for enabling/disabling an input field .
 * @param { HTMLInputElement } target- the target input element
 */
function toggleField(target) {
  target.disabled = !(target.disabled);
  //Searches for the label of the target input element
  let targetLabel = document.querySelector(`label[for='${target.id}']`);
  //Puts a strike-through style on the label
  targetLabel.style.textDecoration = target.disabled ? "line-through" : "none";
}

/**
 * Sets the acceptable max attempt range to [n, 2n], where n is the chosen word length
 */
function setMaxAttemptBounds() {
  var min = wordLength.value;
  var max = 2 * min;
  //Change input field attr
  maxAttempts.min = min;
  maxAttempts.max = max;
  //Change display
  minBound.innerHTML = min;
  maxBound.innerHTML = max;
  //Validates input
  validateInput(maxAttempts);
}

/**
 * Validates and saves the data collected from the form into localStorage
 * @param { HTMLFormElement } form - the target form element
 */
function saveSettings(form) {
  // Validates the inputted word bank
  if (!validateWordBank()) {
    toggleVisibility(settings);
    return false;
  }
  // Utility func to transform form data to object format
  const getFormJSON = (form) => {
    const data = new FormData(form);
    return Array.from(data.keys()).reduce((result, key) => {
      result[key] = data.get(key);
      return result;
    }, {});
  };

  let formObject = getFormJSON(form);
  //Store the 2 colors in the necessary variables
  document.documentElement.style.setProperty("--guess-right-place", formObject["correctColor"]);
  document.documentElement.style.setProperty("--guess-wrong-place", formObject["hintColor"]);
  //Store the entire form data to local storage
  localStorage.setItem("settings", JSON.stringify(formObject));
  return false;
}

/**
 * Alerts user before resetting and resets border style of wordLength and maxAttempts input elements
 */
function resetSettings() {
  if (confirm("Reset form? All your changes will be lost!")) {
    wordLength.border = "2px solid green";
    maxAttempts.border = "2px solid green";
    return true;
  }
  return false;
}

/**
 * Ensures the words in the wordbank follows specified constraints
 */
function validateWordBank() {
  //Regex patterns
  let lettersPattern = /^[a-zA-Z]+$/;
  let spacesPattern = /(\s+)/;
  //Splits the gathered text by using spacesPattern
  let wordArray = wordPool.value.split(spacesPattern);
  //Removes space characters from the wordArray
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i].includes(" "))
      wordArray.splice(i, 1);
  }
  //Traverses through each word
  for (let i = 0; i < wordArray.length; i++) {
    /* Note: for some reason, when a user enters an input with excess spaces, the
    wordArray (despite being filtered from space chars) leaves an empty string element
    at the end. As such, we will just ignore it in validation */
    if (wordArray[i] == '') continue;
    //Tests if the words entered only consist of letters in the english alphabet
    if (!(lettersPattern.test(wordArray[i]))) {
      alert(`Sorry, but words like ${ wordArray[i] } are not valid since they
        contain characters that are not letters`);
      return false;
    }
    //Tests if the words entered follow the specified word length
    if (wordArray[i].length != wordLength.value) {
      alert(`${ wordArray[i] } is not a ${ wordLength.value }-letter word`);
      return false;
    }
  }

  return true;
}