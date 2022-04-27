var XMLHttpRequest = require('xhr2');


// modify HTML from script
document.getElementById("results").innerHTML = `...`;

function result(json) {
    // TODO: change HTML from here e.g. document.getElementById("getcode").elements...
}

var xhttp = new XMLHttpRequest();

xhttp.open('GET', 'http://localhost:3000/board?postcode=sw75qq', true);

xhttp.setRequestHeader('Content-Type', 'application/json');

xhttp.onload = function() {
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
    var resText = xhttp.responseText
    let json = JSON.parse(resText);
    console.log(json)
}

xhttp.send();