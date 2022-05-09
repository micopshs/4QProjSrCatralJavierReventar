// generate a random word, with the seed being the date today.

import { xmur3, mulberry32 } from "./random_functions.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const get_todays_word = function () {
  // get the full array
  const array_of_words = readFileSync(
    dirname(fileURLToPath(import.meta.url)) + "/list_of_5_letter_words.txt",
    "utf8"
  ).split("\n");

  // get the random number
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  const today_string = yyyy + '-' + mm + '-' + dd;
  const todays_random_number = Math.ceil(
    mulberry32(xmur3(today_string)())() * array_of_words.length
  );

  // return today's word
  const todays_word = array_of_words[todays_random_number];
  return todays_word;
};

export default get_todays_word;
