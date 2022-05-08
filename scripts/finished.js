// stuff
var calculate_score = function (taken_attempts, max_attempts, word_length) {
    // for example, if the player took all 6 attempts out of 6,
    // their attempt fraction is 1/6; 5 attempts, 2/6, and so on.
    const taken_attempt_fraction = Number(((max_attempts - taken_attempts + 1) / max_attempts).toPrecision(10));
    // disincentivises taking too many attempts.
    // for example, if a person takes 5 attempts with 6 maximum,
    // their score is higher than if they took 5 attempts with 7 maximum.
    const total_attempt_fraction = Math.pow(0.5, (max_attempts - word_length - 1));
    const current_score = Math.ceil(100 * total_attempt_fraction * taken_attempt_fraction);
    return current_score;
};
var calculate_total_score = function (current_score) {
    let past_total_score = Number(localStorage.getItem("VERBATIM_LS_total_score"));
    if (isNaN(past_total_score) || past_total_score == null) {
        past_total_score = 0;
    }
    const new_total_score = past_total_score + current_score;
    localStorage.setItem("VERBATIM_LS_total_score", new_total_score.toString());
    return new_total_score;
};
var make_histogram = function (attempt_arr) {
    let histogram = new Map();
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
    if (!histogram.get(-1)) {
        histogram.set(-1, 0);
    }
    for (const i of taken_attempt_arr.filter((attempt_number) => attempt_number > attempt_arr[0].wordLength + 1)) {
        histogram.set(-1, histogram.get(i) + histogram.get(-1));
        histogram.delete(i);
    }
    return histogram;
};
const map_to_obj = (map) => {
    const obj = {};
    for (let [k, v] of map)
        obj[k] = v;
    return obj;
};
const construct_par = (str) => {
    let element = document.createElement("p");
    element.appendChild(document.createTextNode(str));
    return element;
};
const construct_svg = (given_num, greatest_num, special_value = false) => {
    const height_px = 25;
    const length_px = (300 * given_num) / greatest_num;
    const text_space_px = height_px;
    const make_svg_elem = (tag_name, content, attributes) => {
        let element = document.createElementNS("http://www.w3.org/2000/svg", tag_name);
        element.appendChild(document.createTextNode(content));
        for (let attr of attributes) {
            element.setAttribute(attr[0], attr[1]);
        }
        return element;
    };
    // prepare the element
    let svg_elem = make_svg_elem("svg", "", new Map([
        ["version", "1.1"],
        ["height", height_px.toString()],
        ["width", (300 + text_space_px).toString()],
    ]));
    svg_elem.appendChild(make_svg_elem("rect", "", new Map([
        ["height", "100%"],
        ["width", `${length_px + text_space_px}px`],
        ["cx", "10px"],
        ["cy", "10px"],
        ["class", `${special_value ? "bar-special" : "bar-normal"}`],
    ])));
    svg_elem.appendChild(make_svg_elem("text", given_num.toString(), new Map([
        ["x", `${length_px}`],
        ["y", "0px"],
        ["text-anchor", "start"],
    ])));
    return svg_elem;
};
var write_recent_attempts_sc = function (container, past_attempts) {
    // get attempts in the same category
    const last_attempt = past_attempts[past_attempts.length - 1];
    const last_attempt_category = last_attempt.wordLength;
    const attempts_same_category = past_attempts.filter((attempt) => attempt.wordLength === last_attempt_category);
    // figure out the exact leaderboard
    const histogram = make_histogram(attempts_same_category);
    const max_try_count = Math.max(...histogram.values());
    for (let [try_number, try_count] of histogram) {
        container.append(construct_par(try_number.toString()));
        container.append(construct_svg(try_count, max_try_count, last_attempt.takenAttempts === try_number));
    }
};
// quasi"main" function
var load_page_data = function () {
    // variables
    const taken_attempts = Number(localStorage.getItem("attempts_taken"));
    const max_attempts = Number(localStorage.getItem("attempts_possible"));
    const word_length = Number(JSON.parse(localStorage.getItem("settings"))["wordLength"]);
    // 1. generate the current score
    const current_score = calculate_score(taken_attempts, max_attempts, word_length);
    document.getElementById("current_score").textContent =
        current_score.toString();
    // 2. generate the total score
    let total_score = calculate_total_score(current_score);
    document.getElementById("total_score").textContent = total_score.toString();
    // 3. get the variables for the past tries
    let past_attempt_string = localStorage.getItem("VERBATIM_LS_past_attempts");
    let past_attempts = [];
    if (past_attempt_string.length !== 0) {
        past_attempts = JSON.parse(past_attempt_string);
    }
    past_attempts.push({
        takenAttempts: taken_attempts,
        maximumAttempts: max_attempts,
        wordLength: word_length,
        score: current_score,
    });
    localStorage.setItem("VERBATIM_LS_past_attempts", JSON.stringify(past_attempts));
    // 4. manipulate the div into showing us our results
    let container_sc = document.getElementById("recent_attempts_same_category");
    write_recent_attempts_sc(container_sc, past_attempts);
};
window.addEventListener("load", load_page_data, false);
//# sourceMappingURL=finished.js.map