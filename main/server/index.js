const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/", express.static(path.join(__dirname, "../client/build")));

let counting = 0;

let inter=setInterval(() => {
  counting = counting + 1;
  if (counting === 5) {
    app.listen(port, () => console.info(`Listening on port ${port}`));
    clearInterval(inter);
  }else{
  console.info(`starting business server - ${counting}`);
  }
}, 1000);
