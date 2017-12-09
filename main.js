var $ = require("jquery");
var fs = require("browserify-fs");
var request = require("request");
var rp = require("request-promise");
$(document).ready(function () {
    getConstants();
    $("#reload").click(function () { return getConstants(); });
    $("#save").click(function () {
        var event = parse();
        save(event);
    });
});
// abstract out the calls
function getConstants() {
    var options = {
        method: "GET",
        uri: "http://localhost:5000/constants",
        json: true
    };
    rp(options).then(function (body) {
        console.log(body);
        populateDropdowns(body);
    }).catch(function (err) {
        throw err;
    });
}
function populateDropdowns(res) {
    // implement error handling on clean-up
    var keys = Object.keys(res);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var k = keys_1[_i];
        console.log("Populating " + k);
        populateDropdown(k, res[k]);
    }
}
function populateDropdown(property, values) {
    var htmlBlock = values.map(function (name) {
        return "<option value=" + name + ">" + name + "</option>";
    }).reduce(function (acc, curr) {
        return acc += curr;
    }, "");
    try {
        $("#current-event--" + property).append(htmlBlock);
    }
    catch (err) {
        // do nothing lmao
    }
}
// next implement guards for things
function save(object) {
    var options = {
        url: "http://localhost:5000/save",
        headers: { "Content-Type": "application/json" },
        body: object,
        json: true
    }; // request.post
    request.post(options, function (err) {
        if (err)
            throw err;
        else
            console.log("Request successful");
    }).on('response', function (response) {
        console.log(response.statusCode);
        alert("Save successful.");
    });
}
function parse() {
    var title = $("#current-event--title").val();
    var desc = $("#current-event--description").val();
    var scriptText = $("#current-event--script").val();
    var script = parseScript(scriptText);
    var character = $("#current-event--character").val();
    var priority = $("#current-event--priority").val();
    var type = $("#current-event--type").val();
    var prerequisites = $("#current-event--prerequisites").val();
    var choices = getChoices();
    var event = {
        "title": title,
        "description": desc,
        "script": script,
        "character": character,
        "priority": priority,
        "type": type,
        "prerequisites": prerequisites,
        "choices": choices
    };
    $("#result").html(event);
    console.log(event);
    return event;
}
function getChoices() {
    var choices = [];
    for (var i = 0; i < 3; i++) {
        var choiceString = "#current-event--choice" + i + 1;
        var choice = $(choiceString + "-category").val();
        var goTo = $(choiceString + "-result").val();
        choices[i] = { choice: goTo };
    }
    return choices;
}
function parseScript(script) {
    var allCommands = [];
    var entries = script.split("\n");
    for (var i = 0; i < entries.length; i++) {
        var text = entries[i];
        var line = void 0;
        if (text[0] == "#") {
            var actions = text.split("#");
            var name_1 = actions[1];
            var args = actions.slice(2);
            line = { "action": name_1,
                "arguments": args };
        }
        else {
            line = { "text": text };
        }
        allCommands[i] = line;
    }
    return allCommands;
}
