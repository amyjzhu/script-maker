var $ = require("jquery");
$(document).ready(function () {
});
function save() {
    var title = $("#current-event--title").value;
    var desc = $("#current-event--description").value;
    var scriptText = $("#current-event--script").value;
    var character = $("#current-event--character").value;
    var choices = getChoices();
}
function getChoices() {
    var choices = [];
    for (var i = 0; i < 3; i++) {
        var choiceString = "#current-event--choice" + i;
        var choice = $(choiceString + "-category").value;
        var goTo = $(choiceString + "-result").value;
    }
    return choices;
}
