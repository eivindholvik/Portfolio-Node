const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

/* GET home page. */
router.get('/', function (req, res, next) {
  const data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { recommendations: JSON.parse(data) });
});

router.post("/", jsonParser, (req, res, next) => {
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  const recommendationsArr = JSON.parse(dataFromFile);
  const filtered = recommendationsArr.filter(recommendation => recommendation.name === req.body.name);
  if (filtered.length === 0) {
    recommendationsArr.push(req.body);
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(recommendationsArr));
    res.end("Recommendation added");
    return;
  }
  res.end("User has already made a recommendation")
});

router.delete("/", jsonParser, (req, res, next) => {
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  const recommendationsArr = JSON.parse(dataFromFile);
  const filtered = recommendationsArr.filter(recommendation => recommendation.name !== req.body.name);
  if (filtered.length !== recommendationsArr) {
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(filtered));
    res.end(`${req.body.name}'s recommendation deleted`);
    return;
  }
  res.end(`Found no recommendation for ${req.body.name}`);
})



module.exports = router;
