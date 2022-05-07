// @ts-check

var draw_graph_one = function () {
  // method: create a table with svgs.
  // TBD: saturday
};

/**
 * Calculates the score. (I thought that was obvious, from the name.)
 * @param {number} taken_attempts
 * @param {number} max_attempts
 * @param {number} word_length
 * @returns {number}
 */
var calculate_score = function (taken_attempts, max_attempts, word_length) {
  // for example, if the player took all 6 attempts out of 6,
  // their attempt fraction is 1/6; 5 attempts, 2/6, and so on.
  const taken_attempt_fraction = Number(
    ((max_attempts - taken_attempts + 1) / max_attempts).toPrecision(10)
  );

  // disincentivises taking too many attempts.
  // for example, if a person takes 5 attempts with 6 maximum,
  // their score is higher than if they took 5 attempts with 7 maximum.
  const total_attempt_fraction = 0.5 ** (max_attempts - word_length - 1);

  const current_score = Math.ceil(
    100 * total_attempt_fraction * taken_attempt_fraction
  );

  return current_score;
};

/**
 *
 * @param {HTMLElement} container
 * @param {any[]} past_attempts
 */
var write_recent_attempts_sc = function (container, past_attempts) {
  const last_attempt = past_attempts[past_attempts.length - 1];
  const last_attempt_category = last_attempt["word_length"];
  const attempts_same_category = past_attempts.filter(
    (attempt) => {attempt["word_length"] === last_attempt_category}
  );

  
};

// quasi"main" function
var load_page_data = function () {
  // variables
  const taken_attempts = Number(localStorage.getItem("attempts_taken"));
  const max_attempts = Number(localStorage.getItem("attempts_possible"));
  const word_length = Number(
    JSON.parse(localStorage.getItem("settings"))["wordLength"]
  );

  // 1. generate the current score
  const current_score = calculate_score(
    taken_attempts,
    max_attempts,
    word_length
  );
  document.getElementById("current_score").textContent =
    current_score.toString();

  // 2. generate the total score
  let past_total_score = Number(
    localStorage.getItem("VERBATIM_LS_total_score")
  );
  if (typeof past_total_score === "undefined") {
    past_total_score = 0;
  }
  const new_total_score = past_total_score + current_score;
  localStorage.setItem("VERBATIM_LS_total_score", new_total_score.toString());
  document.getElementById("total_score").textContent =
    new_total_score.toString();

  // 3. get the variables for the past tries
  let past_attempts = JSON.parse(
    localStorage.getItem("VERBATIM_LS_past_attempts")
  );
  if (typeof past_attempts === undefined) {
    past_attempts = [];
  }
  past_attempts.push({
    taken_attempts: taken_attempts,
    max_attempts: max_attempts,
    word_length: word_length,
    score: current_score,
  });
  localStorage.setItem("VERBATIM_LS_past_attempts", past_attempts);

  // 4. manipulate the div into showing us our results
  let first_table = document.getElementById("recent_attempts_same_category");
};

window.addEventListener("load", load_page_data, false);
