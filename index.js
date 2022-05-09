// other people's imports
import express from "express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

// import my modules
import get_todays_word from "./server/get_todays_word.js";
import generate_random_word from "./server/generate_random_word.js";

// compensate for the fact that I like es2015 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create different urls?
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", async (request, response) => {
  // no use for request?
  response.send(await readFile("./public/html/home.html", "utf8"));
});

app.get("/api/todaysWord", async (request, response) => {
  response.status(200).send({
    word: get_todays_word(),
  });
});

app.post("/api/randomWord/:word_length", (request, response) => {
  const inputs = request.params;

  if (!inputs.word_length) {
    response.status(400).send("No number passed.");
    return;
  }

  if (Number(inputs.word_length) > 7 || Number(inputs.word_length) < 4) {
    response.status(400).send("Number must be between 4 and 7, inclusive.");
    return;
  }

  response.status(200).send({
    word: generate_random_word(Number(inputs.word_length)),
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("App available on port 3000?")
);
