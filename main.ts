var $ = require("jquery");

$(document).ready(function() {

    $("#save").click(function() {
        parse();
    })

    }
);



function save() : void {

}

function parse() : void {
    let title : string = $("#current-event--title").val();
    let desc : string = $("#current-event--description").val();
    let scriptText : string = $("#current-event--script").val();
    let character = $("#current-event--character").val();
    let priority = $("#current-event--priority").val();
    let type = $("#current-event--type").val();
    let prerequisites = $("#current-event--prerequisites").val();
    let choices = getChoices();

    let event = {
        "title": title,
        "description": desc,
        "script": scriptText,
        "character": character,
        "priority":priority,
        "type": type,
        "prerequisites" :prerequisites,
        "choices": choices
    };

    $("#result").html(event);
    console.log(event)
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

function parseScript() {

}