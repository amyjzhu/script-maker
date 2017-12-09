var $ = require("jquery");

$(document).ready(function() {
    }
)


function save() : void {
    let title : string = $("#current-event--title").value;
    let desc : string = $("#current-event--description").value;
    let scriptText : string = $("#current-event--script").value;
    let character = $("#current-event--character").value;
    let choices = getChoices();


}

function getChoices() : any[] {
    let choices = [];

    for (let i = 0; i < 3; i++) {
        let choiceString = "#current-event--choice" + i;
        let choice = $(choiceString + "-category").value;
        let goTo = $(choiceString + "-result").value;
    }

    return choices
}
