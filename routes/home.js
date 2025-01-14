const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();


/* GET home page. */
router.get('/', function (req, res, next) {
  const data = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  res.render('home', { introArray: JSON.parse(data) });
});

router.post("/", (req, res, next) => {
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  const arrayFromFile = JSON.parse(dataFromFile);
  const newLine = req.body.newText;
  let result = arrayFromFile.findIndex((text) => text === newLine);
  if (result !== -1) {
    res.end("Duplicate found");
    return;
  }
  arrayFromFile.push(newLine);
  fs.writeFileSync(path.resolve(__dirname, "../data/introductionArray.json"), JSON.stringify(arrayFromFile));
  res.end("New line added");
})



module.exports = router;
