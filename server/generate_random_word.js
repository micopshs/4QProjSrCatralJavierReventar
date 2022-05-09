// generate a random word, with the seed being the date and time.
import { xmur3, mulberry32 } from "./random_functions.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const generate_random_word = function (word_length = 5) {
    // get the full array
    const array_of_words = readFileSync(dirname(fileURLToPath(import.meta.url)) +
        `/list_of_${word_length}_letter_words.txt`, "utf8").split("\n");
    // get the random number
    const current_date = new Date();
    const date_time = current_date.getFullYear() +
        "-" +
        (current_date.getMonth() + 1) +
        "-" +
        current_date.getDate() +
        " @ " +
        current_date.getHours() +
        ":" +
        current_date.getMinutes() +
        ":" +
        current_date.getSeconds() +
        ":" +
        current_date.getMilliseconds();
    const generated_random_number = Math.ceil(mulberry32(xmur3(date_time)())() * array_of_words.length);
    // return the corresponding word word
    const todays_word = array_of_words[generated_random_number];
    return todays_word;
};
export default generate_random_word;
//# sourceMappingURL=generate_random_word.js.map