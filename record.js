// is this ok???
function findStopCodeR(postcode) {
    const runProgram = async () => {
        let lonlat = await postcode2lonlat(postcode);
        lon = lonlat[0]
        lat = lonlat[1]
        console.log(`We got ${lon} ${lat}`)

        let stops = await lonlat2stop(lon, lat);
        // stop1, stop2 = stops[0], stops[1]       // can't do this?
        stop1 = stops[0][0]
        stop2 = stops[1][0]
        console.log(`We got ${stop1} ${stop2}`)

        for (let i in stops) {
            let details = await showDetails(stops[i])
        }

    }

    runProgram();

}

function showDetails(stopCode) {
    return new Promise((resolve) => {
        let details = []
        appKey = "c2a002a07d574daaa294449eed950387"
        requestLink = "https://api.tfl.gov.uk/StopPoint/" + stopCode + "/Arrivals?app_key=" + appKey
        console.log(requestLink)
        request(requestLink, function (error, response, body) {
            let json = JSON.parse(body);
            let num = json.length       // avoid going out of range
            for (let i = 0; i < Math.min(num, 5); i++) {
                lineName = json[i]["lineName"]
                desName = json[i]["destinationName"]
                time = parseFloat(json[i]["timeToStation"] / 60).toFixed(2)

                console.log(lineName, desName, time)
                details.push([lineName, desName, time])
                resolve(details)
            }
        })

    })
}

// --------------------------------------------------------------
var XMLHttpRequest = require('xhr2');


// modify HTML from script
var postcode="sw75qq"
var XMLHttpRequest = require('xhr2');    // remember to remove when using in browser!!
var xhttp = new XMLHttpRequest();
xhttp.open('GET', 'http://localhost:3000/board?postcode=' + postcode, true);
xhttp.setRequestHeader('Content-Type', 'application/json');
xhttp.onload = function () {
    var resText = xhttp.responseText
    console.log(resText)
    let json = JSON.parse(resText);
    // console.log(json)           // now we got the json, what next?
    console.log("got json")

}
xhttp.send();


