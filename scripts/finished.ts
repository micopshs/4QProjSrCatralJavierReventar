// stuff

interface VerbatimAttempt {
  takenAttempts: number;
  maximumAttempts: number;
  wordLength: number;
  score: number;
}

var calculate_score = function (
  taken_attempts: number,
  max_attempts: number,
  word_length: number
): number {
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

const make_histogram = function (
  attempt_arr: VerbatimAttempt[]
): Map<number, number> {
  let histogram: Map<number, number> = new Map();
  let taken_attempt_arr = attempt_arr.map((attempt) => attempt.takenAttempts);

  for (const num of taken_attempt_arr) {
    histogram.set(num, histogram.get(num) ? histogram.get(num) + 1 : 1);
  }
  // ensure that every number from 1 upward has its own thing
  for (let i = 1; i <= attempt_arr[0].wordLength + 1; ++i) {
    if (!histogram.get(i)) {
      histogram.set(i, 0);
    }
  }
  // force all the things with too high attempts into their own category, -1
  for (const i of taken_attempt_arr.filter(
    (attempt_number) => attempt_number > attempt_arr[0].wordLength + 1
  )) {
    histogram.set(
      -1,
      histogram.get(i) + (histogram.get(-1) ? histogram.get(-1) : 0)
    );
    histogram.delete(i);
  }

  return histogram;
};

const map_to_obj = (map: Map<any, any>): object => {
  const obj = {};
  for (let [k, v] of map) obj[k] = v;
  return obj;
};

var write_recent_attempts_sc = function (
  container: HTMLElement,
  past_attempts: VerbatimAttempt[]
) {
  // get attempts in the same category
  const last_attempt = past_attempts[past_attempts.length - 1];
  const last_attempt_category = last_attempt.wordLength;
  const attempts_same_category = past_attempts.filter((attempt) => {
    attempt.wordLength === last_attempt_category;
  });

  // figure out the exact leaderboard
  const histogram = make_histogram(attempts_same_category);

  container.textContent = map_to_obj(histogram).toString();
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
  let past_attempts: VerbatimAttempt[] = JSON.parse(
    localStorage.getItem("VERBATIM_LS_past_attempts")
  );
  if (typeof past_attempts === undefined) {
    past_attempts = [];
  }
  past_attempts.push({
    takenAttempts: taken_attempts,
    maximumAttempts: max_attempts,
    wordLength: word_length,
    score: current_score,
  });
  localStorage.setItem("VERBATIM_LS_past_attempts", past_attempts.toString());

  // 4. manipulate the div into showing us our results
  let container_sc = document.getElementById("recent_attempts_same_category");
  write_recent_attempts_sc(container_sc, past_attempts);
};

window.addEventListener("load", load_page_data, false);
