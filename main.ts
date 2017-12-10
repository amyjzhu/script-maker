var $ = require("jquery");
var fs = require("browserify-fs");
var request = require("request");
var rp = require("request-promise");

let server = "http://13.59.22.196:5000/";

// make object
let cache = [];

$(document).ready(function() {

    getConstants();
    $("#reload").click(() => getConstants());

    //refactor with promises
    getExistingScriptInfo();

    $("#download").click(function() {
        let event = parse();
        download(event);
    })

    $("#save").click(function() {
        let event = parse();
        cache[cache.length+1] = event;
        save(cache);
    })

    }
);

function download(info : any) {
    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([
        JSON.stringify(info)], {type : 'application/json'}));
    a.download = 'script_local.json';

// Append anchor to body.
    document.body.appendChild(a);
    a.click();

// Remove anchor from body
    document.body.removeChild(a);
}

function getExistingScriptInfo()  {
    let options = {
        method: "GET",
        uri:server + "data",
        json:true
    };

    rp(options).then(function(body) {
        console.log(body);
        $("#save").prop("disabled", false);
        cache = body;
        makePrettyHtmlElement(body[0]);
    }).catch(function(err) {
        throw err;
    });

    // then display existing info
}


// abstract out the calls
function getConstants() {
    let options = {
        method: "GET",
        uri:server + "constants",
        json:true
    };

    rp(options).then(function (body) {
        console.log(body);
        populateDropdowns(body);
    }).catch(function(err) {
        throw err;
    })
}

function populateDropdowns(res: any) {
    // implement error handling on clean-up
    let keys = Object.keys(res);
    for (let k of keys) {
        console.log("Populating " + k);
        populateDropdown(k, res[k]);
    }
}

function populateDropdown(property : string, values : any) {
    let htmlBlock = values.map((name) => {
        return "<option value=" + name + ">" + name + "</option>";
    }).reduce((acc : string, curr : string) : string => {
        return acc += curr;
    },"");
    try {
        $("#current-event--" + property).append(htmlBlock);
    } catch (err) {
        // do nothing lmao
    }
}


function makePrettyHtmlElement(entry : any) {
    let div = $("<div>", {"class":"old-event--display"/*, id:entry["priority"]*/});
    document.createElement("div");
    let title = document.createElement("h1");
    title.textContent = entry["title"] + "br";
    let description = document.createElement("span");
    description.textContent =  entry["description"];

    div.append(title);
    div.append(description);

    $("#result-box").append(div);
}



// next implement guards for things

function save(object : any) : void {
    let options = {
        url: server + "save",
        headers: {"Content-Type": "application/json"},
        body:[object],
        json:true
    }; // request.post
    request.post(options, function(err) {
        if (err) throw err;
        else console.log("Request successful");
    }).on('response', function(response) {
        console.log(response.statusCode);
        alert("Save successful.");
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