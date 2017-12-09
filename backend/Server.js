"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var cors = require('cors');
var filePath = "sample/script.json";
app.use(express.static(path.join(__dirname, ''))); // ??
app.use(cors());
app.use(bodyParser.json());
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
app.listen(5000);
console.log("Listening on 5000...");
