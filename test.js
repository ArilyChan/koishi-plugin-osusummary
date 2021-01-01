const OsuSummary = require("./index").OsuSummary;

const psq = new OsuSummary({
    apiKey: require("./apiToken.json").apiToken
});


const myQQ = 1;
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (line) => {
    console.log(await psq.apply(myQQ, line));
});

