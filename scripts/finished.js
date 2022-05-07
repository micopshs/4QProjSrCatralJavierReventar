

var draw_graph_one = function (canvas_context) {
  // method: create a table with svgs.
  // TBD: saturday
}

// quasi"main" function
var load_page_data = function () {
  // variables
  const taken_attempts = localStorage.getItem("attempts_taken");
  const possible_attempts = localStorage.getItem("attempts_possible");
  const word_length = localStorage.getItem("wordLength");

  // 1. generate the current score
  // for example, if the player took all 6 attempts out of 6,
  // their attempt fraction is 1/6; 5 attempts, 2/6, and so on.
  const taken_attempt_fraction = (possible_attempts - taken_attempts + 1)/(possible_attempts);
  // disincentivises taking too many attempts.
  // for example, if a person takes 5 attempts with 6 maximum,
  // their score is higher than if they took 5 attempts with 7 maximum.
  const total_attempt_fraction = (1/2)**(possible_attempts-word_length-1)
  const current_score = Math.ceil(100 * total_attempt_fraction * taken_attempt_fraction);
  document.getElementById("current_score").textContent = current_score;

  // 2. generate the total score
  let past_total_score = localStorage.getItem("VERBATIM_LS_total_score");
  if (typeof total_score === 'undefined') {
    total_score = 0;
  }
  const new_total_score = past_total_score + current_score;
  localStorage.setItem("VERBATIM_LS_total_score", new_total_score);
  document.getElementById("total_score").textContent = new_total_score;

  // 3. generate the first bar graph
  let first_canvas = document.getElementById("recent_attemps_same_category");
  let canvas_context = first_canvas.getContext('2d');
  draw_graph_one(canvas_context);
}