"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var cors = require('cors');
var filePath = "sample/script.json";
var constantsPath = "backend/Dropdown.json";
app.use(express.static(path.join(__dirname, ''))); // ??
app.use(cors());
app.use(bodyParser.json());
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); // how to fix CORS issues? */
app.get('/', function (req, res) {
    res.send('Received request\n');
});
app.post('/save', function (req, res) {
    var data = req.body;
    console.log(data);
    var dataString = JSON.stringify(data);
    fs.writeFile(filePath, dataString, function (err) {
        if (err)
            throw err;
        else
            res.status(200).send("hooray!");
    });
});
app.get('/data', function (req, res) {
    res.status(500).send("Not yet implemented.");
});
// can't this just be a path to the resoure?
app.get('/constants', function (req, resp) {
    fs.readFile(constantsPath, 'utf8', function (err, result) {
        if (err)
            throw err;
        console.log(result);
        resp.status(200).send(result);
        console.log("Sent constants");
    });
});
app.listen(5000);
console.log("Listening on 5000...");
