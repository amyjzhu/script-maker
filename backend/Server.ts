import * as path from "path";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var cors = require('cors');

let filePath = "sample/script.json";
let constantsPath = "backend/Dropdown.json";

app.use(express.static(path.join(__dirname, ''))); // ??
app.use(cors());
app.use(bodyParser.json());
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); // how to fix CORS issues? */

app.get('/', function(req, res) {
    res.send('Received request\n');
});

app.post('/save', function(req, res) {
    let data = req.body;
    console.log(data);
    let dataString = JSON.stringify(data);
    fs.writeFile(filePath, dataString, (err) => {
        if (err) throw err;
        else res.status(200).send("hooray!");
    })
});

app.get('/data', function(req, res) {
    fs.readFile(filePath, 'utf8', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.status(200).send(result);
        console.log("Sent constants");
    });
});

// can't this just be a path to the resoure?
app.get('/constants', (req, resp) => {
    fs.readFile(constantsPath, 'utf8', function(err, result) {
       if (err) throw err;
       console.log(result);
       resp.status(200).send(result);
       console.log("Sent constants");
    });
});

app.listen(5000);
console.log("Listening on 5000...");


// dogescriptable