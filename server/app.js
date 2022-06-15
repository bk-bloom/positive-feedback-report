require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { getSurveysResponseInBulk } = require("./api");

const app = express();
const PORT = process.env.PORT || 8080;



app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/report", async (req, res) => {
  const { name } = req.query;

  const { strengthWords, valueWords, appreciateComments, expectComments } =
    await getSurveysResponseInBulk(name);

  res.json({
    strengthWords,
    valueWords,
    appreciateComments,
    expectComments,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

