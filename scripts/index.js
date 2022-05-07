function toggleVisibility(target) {
  target.open = !(target.open)
  if (target.open) document.body.style.background = "rgba(0, 0, 0, 0.7)";
  else document.body.style.background = "";
}

function toggleField(target) {
  target.disabled = !(target.disabled);
}

function setMaxAttemptBounds() {
  var min = wordLength.value;
  var max = 2 * min;
  //Change input field attr
  maxAttempts.min = min;
  maxAttempts.max = max;
  // Change display
  minBound.innerHTML = min;
  maxBound.innerHTML = max;
}

function saveSettings(form) {
  if (!validateWordBank()) {
    toggleVisibility(settings);
    return false;
  }
  // Utility func to form data to object format
  const getFormJSON = (form) => {
    const data = new FormData(form);
    return Array.from(data.keys()).reduce((result, key) => {
      result[key] = data.get(key);
      return result;
    }, {});
  };

  let formObject = getFormJSON(form);
  // store the 2 colors in the necessary variables
  document.documentElement.style.setProperty("--guess-right-place", formObject["correctColor"]);
  document.documentElement.style.setProperty("--guess-wrong-place", formObject["hintColor"]);
  // store the entire form data to local storage
  localStorage.setItem("settings", JSON.stringify(formObject));
  return false;
}

function validateWordBank() {
  let lettersPattern = /^[a-zA-Z]+$/;
  let spacesPattern = /(\s+)/;
  let wordArray = wordPool.value.split(spacesPattern);
  
  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i].includes(" ")) 
      wordArray.splice(i, 1);
  }

  for (let i = 0; i < wordArray.length; i++) {
    if (wordArray[i] == '') continue;
    if (!(lettersPattern.test(wordArray[i]))) {
      alert(`Sorry, but words like ${ wordArray[i] } are not valid since they contain characters that are not letters`);
      return false;
    }
    if (wordArray[i].length != wordLength.value) {
      alert(`${ wordArray[i] } is not a ${ wordLength.value }-letter word`);
      return false;
    }
  }

  return true;
}

function loadDefault() {
  if (Object.keys(localStorage).length == 0) saveSettings(settingsForm);
}