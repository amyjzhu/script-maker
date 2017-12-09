var $ = require("jquery");
var fs = require("browserify-fs");
var request = require("request");
$(document).ready(function () {
    $("#save").click(function () {
        var event = parse();
        save(event);
    });
});
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
