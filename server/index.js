const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("yey");
  res.send('<a href="/auth/google">Authenticate with Goggle</a>');
});

app.listen(5000, () => {
  console.log("server is running");
});
