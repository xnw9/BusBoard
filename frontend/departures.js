
function format(json) {
    return json["time"] + " minutes: " + json["lineName"] + " to " + json["desName"]
}

function result() {
    // get user input - success
    var inputs = document.getElementById("getcode").elements;
    var postcode = inputs["postcode"].value.replace(" ", "");   // get rid of space

    alert("Got postcode: " + postcode)

    // send request and get json result
    // var XMLHttpRequest = require('xhr2');    // remember to remove when using in browser!!
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'http://localhost:3000/board?postcode=' + postcode, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function () {
        var resText = xhttp.responseText
        let json = JSON.parse(resText);
        console.log(json)           // now we got the json, what next?
        console.log("got json")
    }
    xhttp.send();

    // TODO: get json from our API!
    json = {
        stop2: {
            '1': { lineName: '214', desName: 'Highgate Village', time: '14' },
            '2': { lineName: '214', desName: 'Highgate Village', time: '1' },
            '3': { lineName: '214', desName: 'Highgate Village', time: '23' },
            '4': { lineName: '88', desName: 'Parliament Hill Fields', time: '15' },
            '5': { lineName: '88', desName: 'Parliament Hill Fields', time: '5' },
            commonName: 'Lady Somerset Road'
        },
        stop1: {
            '1': {
                lineName: '214',
                desName: 'Moorgate, Finsbury Square',
                time: '12'
            },
            '2': {
                lineName: '214',
                desName: 'Moorgate, Finsbury Square',
                time: '2'
            },
            '3': { lineName: '88', desName: 'Clapham Common', time: '17' },
            '4': { lineName: '88', desName: 'Clapham Common', time: '29' },
            '5': { lineName: '88', desName: 'Clapham Common', time: '5' },
            commonName: 'Greenwood Centre'
        }
    }

    // yeap chang the html here - success, just add id to those need to be changed!!
    document.getElementById("result").innerHTML = "Result for " + postcode
    document.getElementById("stop1").innerHTML = json["stop1"]["commonName"]
    document.getElementById("stop2").innerHTML = json["stop2"]["commonName"]

    // result for stop 1
    for (let i = 1; i <= Object.keys(json["stop1"]).length-1; i++) {
        document.getElementById("stop1_" + String(i)).innerHTML = format(json["stop1"][String(i)])
    }

    // result for stop 2
    for (let i = 1; i <= Object.keys(json["stop2"]).length-1; i++) {
        document.getElementById("stop2_" + String(i)).innerHTML = format(json["stop2"][String(i)])
    }

    // TODO: ONLY ADD li if there is more!
}

