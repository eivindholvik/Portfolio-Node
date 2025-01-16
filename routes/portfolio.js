const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const request = require("request");
const ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
const ensureLoggedIn = ensureLogIn();


/* GET home page. */
router.get('/', function (req, res, next) {
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  const cakes = JSON.parse(dataFromFile);
  res.render('portfolio', { cakes });
});

router.post("/", jsonParser, (req, res, next) => {
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  const cakes = JSON.parse(dataFromFile);
  const filtered = cakes.filter(({ name }) => name === req.body.name);
  if (filtered.length !== 0) {
    res.end("The name of the cake already exsits");
    return;
  }
  download(req.body.url, req.body.name, () => {
    console.log(`${req.body.name} was successfully downloaded to path`);
  });
  cakes.push(req.body);
  fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(cakes));
  res.end(`New cake added to portfolio`);

});

router.delete("/", jsonParser, ensureLoggedIn, (req, res, next) => {
  console.log(req);
  const dataFromFile = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  const cakes = JSON.parse(dataFromFile);
  const filtered = cakes.filter(({ name }) => name !== req.body.name);
  if (filtered.length === cakes.length) {
    res.end("Could not find the name");
    return;
  }
  fs.unlink(path.resolve(__dirname, "../data/img/" + req.body.name), () => {
    console.log(`${req.body.name} was successfully delete!`);
  });
  fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(filtered));
  res.json("Successfully deleted cake");
});

//download image to the server:
function download(url, filename, callback) {
  request.head(url, function (err, res, body) {
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/' + filename))).on('close', callback);
  });
};

module.exports = router;
