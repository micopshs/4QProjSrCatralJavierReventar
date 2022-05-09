import express from "express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

// compensate for the fact that I like es2015 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// create different urls?
const app = express();

app.use(express.static(__dirname + "/public"));

app.get('/', async (request, response) => {
    // no use for request?
    response.send(await readFile("./public/html/home.html", "utf8"));
});

app.listen(process.env.PORT || 3000, () => console.log("App available on port 3000?"));