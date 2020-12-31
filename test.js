"use strict";

const osudailyQuery = require("./index").osuSummary;

let psq = new osudailyQuery({
    apiKey: require("./apiToken.json").apiToken
})


let myQQ = 1;
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (line) => {
    console.log(await psq.apply(myQQ, line));
});

