function reveal(target) {
  target.open = !(target.open)
}

function disable(target) {
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

function saveSettings(formElement) {
  // Utility func to form data to object format
  const getFormJSON = (form) => {
    const data = new FormData(form);
    return Array.from(data.keys()).reduce((result, key) => {
      result[key] = data.get(key);
      return result;
    }, {});
  };

  let formObject = getFormJSON(formElement);
  // store the 2 colors in the necessary variables
  document.documentElement.style.setProperty("--guess-right-place", formObject["correctColor"]);
  document.documentElement.style.setProperty("--guess-wrong-place", formObject["hintColor"]);
  // store the entire form data to local storage
  localStorage.setItem("settings", JSON.stringify(formObject));

  return false;
}