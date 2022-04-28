function format(json) {
    return json["time"] + " minutes: " + json["lineName"] + " to " + json["desName"]
}

function result() {
    // ----- get user input - success
    var inputs = document.getElementById("getcode").elements;
    var postcode = inputs["postcode"].value.replace(" ", "");

    alert("Got postcode: " + postcode)

    // ----- send request and get json result
    // var XMLHttpRequest = require('xhr2');    // remember to remove before using in browser
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'http://localhost:3000/board?postcode=' + postcode, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function () {
        var resText = xhttp.responseText
        let json = JSON.parse(resText);
        console.log(json)
        console.log("got json")

        // change html here - success
        document.getElementById("result").innerHTML = "Result for " + postcode

        for (let i=1; i<=2; i++) {
            let stop = "stop" + String(i)
            document.getElementById(stop).innerHTML = json[stop]["commonName"]

            for (let j = 1; j <= Object.keys(json[stop]).length - 1; j++) {
                document.getElementById(stop+"_" + String(i)).innerHTML = format(json[stop][String(i)])
            }
        }

        /*
        // add list elements only when required - failed
        for (let i = 1; i <= 2; i++) {
            var theStop = "stop" + String(i)
            for (let j in Object.keys(json[theStop]).length - 2) {
                var ul = document.getElementById(theStop+"_buses");
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(" "));
                li.setAttribute("id", theStop + "_"+String(j+3)); // added line
                ul.appendChild(li);
                console.log(ul, li)
            }
        }
                */

    }
    xhttp.send();
}

