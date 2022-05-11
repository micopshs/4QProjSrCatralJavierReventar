// stuff
import globalSettings from "./globals.js";
// quasi-"main" function
const loadpagedata = function () {
    // set up all the stuff
    const settingsdialog = document.getElementById("settingsDialog");
    const mechanicsdialog = document.getElementById("mechanics");
    document
        .querySelector("#settingsForm")
        .addEventListener("submit", function () {
        return saveSettings(this);
    });
    document.querySelector("#wordLength").addEventListener("change", function () {
        setMaxAttemptBounds(this, document.querySelector("#maxAttempts"));
    });
    document.querySelector("#hints").addEventListener("change", () => {
        disableInput(document.querySelector("#hintColor"));
    });
    const btns = document.querySelectorAll("main > button");
    btns[0].addEventListener("click", () => {
        toggleVisibility(mechanicsdialog);
    });
    btns[1].addEventListener("click", () => {
        toggleVisibility(settingsdialog);
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
        toggleVisibility(mechanicsdialog);
    });
};
/**
 * Toggles the visibility of a dialog element
 * with the object itself passed in.
 * @param target the object itself. Use window.id to call.
 */
function toggleVisibility(target) {
    if (!target.open) {
        target.showModal();
        document.body.style.background = "rgba(0, 0, 0, 0.7)";
    }
    else {
        target.close();
        document.body.style.background = "";
    }
}
/**
 * Toggles the visibility of a selected form input element.
 * @param target The Form input element itself. Use window.id to call.
 */
function disableInput(target) {
    target.disabled = !target.disabled;
}
/**
 * Sets the bounds for the maxattemptinput element using information gathered
 * from the wordlengthinput element: namely, that twice the word length
 * inputted should be exactly equal to the maximum element. It will also affect
 * the spans with ids "minBound" and "maxBound", even though
 * it does not take those elements as inputs.
 *
 * This function is not pure.
 * @param wordlengthinput The form input element containing the length of the word.
 * @param maxattemptinput The form input element containing the max attempt. Note:
 * this element will be manipulated, unlike the previous one, which is const.
 */
function setMaxAttemptBounds(wordlengthinput, maxattemptinput) {
    const min = Number(wordlengthinput.value);
    const max = 2 * min;
    // Change input field attr
    maxattemptinput.min = min.toString();
    maxattemptinput.max = max.toString();
    // Change display
    document.getElementById("minBound").textContent = min.toString();
    document.getElementById("maxBound").textContent = max.toString();
}
const validateWordBank = (inputbank, wordlength) => {
    const lettersPattern = /^[a-zA-Z]+$/;
    const spacesPattern = /(\s+)/;
    const wordArray = inputbank.split(spacesPattern);
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i].includes(" "))
            wordArray.splice(i, 1);
    }
    for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] == "")
            continue;
        if (!lettersPattern.test(wordArray[i])) {
            alert(`Sorry, but words like ${wordArray[i]} are not valid since they contain characters that are not letters`);
            return false;
        }
        if (wordArray[i].length != wordlength) {
            alert(`${wordArray[i]} is not a ${wordlength}-letter word`);
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
function saveSettings(form) {
    // preserve settings in the global
    globalSettings.setSettings(new FormData(form));
    globalSettings.saveSettings();
    // validate the word bank
    const wordbank = form.querySelector("textarea").value;
    if (!validateWordBank(wordbank, globalSettings.wordLength)) {
        return false;
    }
    // store the 2 colors in the necessary variables
    document.documentElement.style.setProperty("--guess-right-place", globalSettings.correctColor);
    document.documentElement.style.setProperty("--guess-wrong-place", globalSettings.hintColor);
    // success: make the modal disappear
    toggleVisibility(document.querySelector("#settingsDialog"));
    return false;
}
window.addEventListener("load", loadpagedata, false);
//# sourceMappingURL=home.js.map