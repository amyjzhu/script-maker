var $ = require("jquery");
var fs = require("browserify-fs");
var request = require("request");

$(document).ready(function() {

    $("#save").click(function() {
        let event = parse();
        save(event);
    })

    }
);

// next implement guards for things

function save(object : any) : void {
    let options = {
        url: "http://localhost:5000/save",
        headers: {"Content-Type": "application/json"},
        body:object,
        json:true
    }; // request.post
    request.post(options, function(err) {
        if (err) throw err;
        else console.log("Request successful");
    }).on('response', function(response) {
        console.log(response.statusCode);
    });
}

function parse() : any {
    let title : string = $("#current-event--title").val();
    let desc : string = $("#current-event--description").val();
    let scriptText : string = $("#current-event--script").val();
    let script = parseScript(scriptText);
    let character = $("#current-event--character").val();
    let priority = $("#current-event--priority").val();
    let type = $("#current-event--type").val();
    let prerequisites = $("#current-event--prerequisites").val();
    let choices = getChoices();

    let event = {
        "title": title,
        "description": desc,
        "script": script,
        "character": character,
        "priority":priority,
        "type": type,
        "prerequisites" :prerequisites,
        "choices": choices
    };

    $("#result").html(event);
    console.log(event);

    return event;
}

function getChoices() : any[] {
    let choices = [];

    for (let i = 0; i < 3; i++) {
        let choiceString = "#current-event--choice" + i+1;
        let choice = $(choiceString + "-category").val();
        let goTo = $(choiceString + "-result").val();
        choices[i] = {choice: goTo};
    }

    return choices;
}

function parseScript(script : string) : any[] {
    let allCommands = [];
    let entries : string[] = script.split("\n");

    for (let i = 0; i < entries.length; i++) {
        let text = entries[i];
        let line;
        if (text[0] == "#") {
            let actions = text.split("#");
            let name = actions[1];
            let args = actions.slice(2);
            line = {"action": name,
            "arguments":args};
        }
        else {
            line = {"text": text};
        }
        allCommands[i] = line;
    }
    return allCommands;
}