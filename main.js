var $ = require("jquery");
var fs = require("browserify-fs");
var request = require("request");
var rp = require("request-promise");
var server = "http://13.59.22.196:5000/";
// make object
var eventsCache = [];
$(document).ready(function () {
    getConstants();
    $("#reload").click(function () { return getConstants(); });
    //refactor with promises
    getExistingScriptInfo();
    $("#download").click(function () {
        var event = parse();
        download(event);
    });
    // ignore if already cached - hashmap with title?
    $("#save").click(function () {
        var event = parse();
        eventsCache[eventsCache.length] = event;
        console.log(eventsCache);
        save(eventsCache);
    });
});
function download(info) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([
        JSON.stringify(info)
    ], { type: 'application/json' }));
    a.download = 'script_local.json';
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();
    // Remove anchor from body
    document.body.removeChild(a);
}
function getExistingScriptInfo() {
    var options = {
        method: "GET",
        uri: server + "data",
        json: true
    };
    rp(options).then(function (body) {
        console.log(body);
        $("#save").prop("disabled", false);
        eventsCache.push.apply(eventsCache, body);
        console.log(eventsCache);
        displayOldEvents();
    }).catch(function (err) {
        throw err;
    });
    // then display existing info
}
function displayOldEvents() {
    for (var _i = 0, eventsCache_1 = eventsCache; _i < eventsCache_1.length; _i++) {
        var thing = eventsCache_1[_i];
        console.log("making display for " + thing);
        makePrettyHtmlElement(thing);
    }
}
function makePrettyHtmlElement(entry) {
    if (entry != null) {
        console.log(entry);
        var div = $("<div>", { "class": "old-event--display" /*, id:entry["priority"]*/ });
        document.createElement("div");
        var title = document.createElement("h1");
        title.textContent = entry.title;
        var description = document.createElement("span");
        description.textContent = entry.description;
        div.append(title);
        div.append(description);
        $("#result-box").append(div);
    }
}
// abstract out the calls
function getConstants() {
    var options = {
        method: "GET",
        uri: server + "constants",
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
    console.log("Saving " + JSON.stringify(object));
    var options = {
        url: server + "save",
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
