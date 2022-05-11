// stuff

import globalSettings from "./globals.js";

// new convenience type
interface VerbatimAttempt {
  takenAttempts: number;
  maximumAttempts: number;
  wordLength: number;
  score: number;
}

// quasi"main" function
const loadpagedata = function () {
  // variables
  const takenattempts = Number(localStorage.getItem("attemptstaken"));
  localStorage.removeItem("attemptstaken");
  const maxattempts = globalSettings.maxAttempts;
  const wordlength = globalSettings.wordLength;

  // 1bis. fill in the correct word
  document.getElementById("correctword").textContent =
    localStorage.getItem("correctword");
  localStorage.removeItem("correctword");

  // 1. generate the current score
  const currentscore = calculatescore(
    takenattempts,
    maxattempts,
    wordlength
  );
  document.getElementById("currentscore").textContent =
    currentscore.toString();

  // 2. generate the total score
  const totalscore = calculatetotalscore(currentscore);
  document.getElementById("totalscore").textContent = totalscore.toString();

  // 3. get the variables for the past tries
  const pastattemptstring = localStorage.getItem("VERBATIMLSpastattempts");
  let pastattempts: VerbatimAttempt[] = [];
  if (pastattemptstring !== null) {
    pastattempts = JSON.parse(pastattemptstring);
  }

  pastattempts.push({
    takenAttempts: takenattempts,
    maximumAttempts: maxattempts,
    wordLength: wordlength,
    score: currentscore,
  });
  localStorage.setItem(
    "VERBATIMLSpastattempts",
    JSON.stringify(pastattempts)
  );

  // 4. manipulate the div into showing us our results
  const containersamectgy = document.getElementById(
    "recentattemptssamectgy"
  );
  writesamectgyleaderboard(containersamectgy, pastattempts);
  const containercrossctgy = document.getElementById("recentcategories");
  writecrossctgyleaderboard(containercrossctgy, pastattempts);

  // 5. add necessary things to page data
  document.getElementById("backtostart").addEventListener("click", () => {
    window.location.href = "/html/home.html";
  });
};

var calculatescore = function (
  takenattempts: number,
  maxattempts: number,
  wordlength: number
): number {
  // for example, if the player took all 6 attempts out of 6,
  // their attempt fraction is 1/6; 5 attempts, 2/6, and so on.
  const takenattemptfraction = Number(
    ((maxattempts - takenattempts + 1) / maxattempts).toPrecision(10)
  );

  // disincentivises taking too many attempts.
  // for example, if a person takes 5 attempts with 6 maximum,
  // their score is higher than if they took 5 attempts with 7 maximum.
  const totalattemptfraction = 0.5 ** (maxattempts - wordlength - 1);

  const currentscore = Math.ceil(
    100 * totalattemptfraction * takenattemptfraction
  );

  return currentscore;
};

var calculatetotalscore = function (currentscore: number): number {
  let pasttotalscore = Number(
    localStorage.getItem("VERBATIMLStotalscore")
  );
  if (isNaN(pasttotalscore) || pasttotalscore == null) {
    pasttotalscore = 0;
  }

  const newtotalscore = pasttotalscore + currentscore;
  localStorage.setItem("VERBATIMLStotalscore", newtotalscore.toString());
  return newtotalscore;
};

const makehistogram = (array: number[]): Map<number, number> => {
  const histogram: Map<number, number> = new Map();
  for (const num of array) {
    histogram.set(num, histogram.get(num) ? histogram.get(num) + 1 : 1);
  }
  return histogram;
};

const maptoobj = (map: Map<any, any>): object => {
  const obj = {};
  for (const [k, v] of map) obj[k] = v;
  return obj;
};

const constructlabel = (str: string): HTMLElement => {
  const element = document.createElement("p");
  element.appendChild(document.createTextNode(str));
  return element;
};

const constructbar = (
  givennum: number,
  greatestnum: number,
  specialvalue = false
): Element => {
  const heightpx = 25;
  const lengthpx = (300 * givennum) / greatestnum;
  const textspacepx = heightpx;

  const makesvgelem = (
    tagname: string,
    content: string,
    attributes: Map<string, string>
  ): Element => {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      tagname
    );
    element.appendChild(document.createTextNode(content));
    for (const attr of attributes) {
      element.setAttribute(attr[0], attr[1]);
    }
    return element;
  };

  // prepare the element
  const svgelem = makesvgelem(
    "svg",
    "",
    new Map([
      ["version", "1.1"],
      ["height", heightpx.toString()],
      ["width", (300 + textspacepx).toString()],
    ])
  );

  svgelem.appendChild(
    makesvgelem(
      "rect",
      "",
      new Map([
        ["height", "100%"],
        ["width", `${lengthpx + textspacepx}px`],
        ["cx", "10px"],
        ["cy", "10px"],
        ["class", `${specialvalue ? "bar-special" : "bar-normal"}`],
      ])
    )
  );

  svgelem.appendChild(
    makesvgelem(
      "text",
      givennum.toString(),
      new Map([
        ["x", `${lengthpx}`],
        ["y", "0px"],
        ["text-anchor", "start"],
      ])
    )
  );

  return svgelem;
};

var writesamectgyleaderboard = function (
  container: HTMLElement,
  pastattempts: VerbatimAttempt[]
) {
  // get attempts in the same category
  const lastattempt = pastattempts[pastattempts.length - 1];
  const ctgywordlength = lastattempt.wordLength;
  const samectgyattempts = pastattempts.filter(
    (attempt) => attempt.wordLength === ctgywordlength
  );

  // figure out the exact leaderboard
  const samectgytakenattempts = samectgyattempts.map(
    (attempt) => attempt.takenAttempts
  );
  const samectgyleaderboard = makehistogram(samectgytakenattempts);
  // ensure that every number from 1 upward has its own thing
  for (let i = 1; i <= ctgywordlength + 1; ++i) {
    if (!samectgyleaderboard.get(i)) {
      samectgyleaderboard.set(i, 0);
    }
  }
  // force all the things with too high attempts into their own ctgy, -1
  samectgyleaderboard.set(-1, 0);
  for (const i of samectgytakenattempts.filter(
    (attemptnumber) => attemptnumber > ctgywordlength + 1
  )) {
    samectgyleaderboard.set(
      -1,
      samectgyleaderboard.get(i) + samectgyleaderboard.get(-1)
    );
    samectgyleaderboard.delete(i);
  }
  // dispose of 0 attempt things- that just means a visit
  if (samectgyleaderboard.get(0)) {
    samectgyleaderboard.delete(0);
  }

  // make the leaderboard
  const maxtrycount = Math.max(...samectgyleaderboard.values());
  for (const [trynumber, trycount] of samectgyleaderboard) {
    container.append(
      constructlabel(`${trynumber === -1 ? "Other" : trynumber}`)
    );
    container.append(
      constructbar(
        trycount,
        maxtrycount,
        lastattempt.takenAttempts === trynumber
      )
    );
  }
};

var writecrossctgyleaderboard = function (
  container: HTMLElement,
  pastattempts: VerbatimAttempt[],
  specialvalue = false
) {
  const lastattempt = pastattempts[pastattempts.length - 1];
  const lastwordlength = lastattempt.wordLength;

  // figure out the leaderboard
  const takencategories = pastattempts.map((attempt) => attempt.wordLength);
  const crossctgyleaderboard = makehistogram(takencategories);
  // TODO: FIX LATER TO NOT USE MAGIC CONSTANTS
  // ensure that each category has its own thing
  for (let i = 4; i <= 7; ++i) {
    if (!crossctgyleaderboard.get(i)) {
      crossctgyleaderboard.set(i, 0);
    }
  }
  // if there are strays, put it in a -1 space
  crossctgyleaderboard.set(-1, 0);
  for (const oddcategory of takencategories.filter(
    (categorynum) => categorynum > 7 || categorynum < 4
  )) {
    crossctgyleaderboard.set(
      -1,
      crossctgyleaderboard.get(-1) + crossctgyleaderboard.get(oddcategory)
    );
    crossctgyleaderboard.delete(oddcategory);
  }

  // create that leaderboard
  const mostattemptedctgy = Math.max(...crossctgyleaderboard.values());
  for (const [category, categorycount] of crossctgyleaderboard) {
    container.append(
      constructlabel(`${category === -1 ? "Other" : category}`)
    );
    container.append(
      constructbar(categorycount, mostattemptedctgy, specialvalue)
    );
  }
};

window.addEventListener("load", loadpagedata, false);
