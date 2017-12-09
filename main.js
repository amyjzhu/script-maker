var $ = require("jquery");
$(document).ready(function () {
    $("#save").click(function () {
        parse();
    });
});
function save() {
}
function parse() {
    var title = $("#current-event--title").val();
    var desc = $("#current-event--description").val();
    var scriptText = $("#current-event--script").val();
    var character = $("#current-event--character").val();
    var priority = $("#current-event--priority").val();
    var type = $("#current-event--type").val();
    var prerequisites = $("#current-event--prerequisites").val();
    var choices = getChoices();
    var event = {
        "title": title,
        "description": desc,
        "script": scriptText,
        "character": character,
        "priority": priority,
        "type": type,
        "prerequisites": prerequisites,
        "choices": choices
    };
    $("#result").html(event);
    console.log(event);
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
function parseScript() {
}
