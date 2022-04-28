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
var XMLHttpRequest = require('xhr2');
const request = require("request");    // remember to remove when using in browser!!
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


// -------------------------------- app.js -----------------------------------
function postcode2lonlat(postcode) {
    return new Promise((resolve) => {
        if (postcode.includes(" ")) {
            postcode = postcode.replace(" ", "")
        }
        requestLink = "https://api.postcodes.io/postcodes/" + postcode
        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            lon = json["result"]["longitude"]
            lat = json["result"]["latitude"]

            console.log(lon, lat, "!!!")

            resolve([lon, lat])

        })
    })
}

function lonlat2stop(lon, lat) {
    return new Promise((resolve) => {
        stoptype = "NaptanPublicBusCoachTram"
        requestLink = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stoptype}&radius=500`
        console.log(requestLink)
        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            let stop1 = [json["stopPoints"][0]["naptanId"], json["stopPoints"][0]["commonName"]]
            let stop2 = [json["stopPoints"][1]["naptanId"], json["stopPoints"][1]["commonName"]]

            console.log(stop1, stop2, "!!!")

            resolve([stop1, stop2])

        })

    })
}

// lonlat2stop(-0.038207, 51.491035)
function getStopsDetails(stops) {
    return new Promise((resolve) => {
        stop1 = stops[0][0]
        stop2 = stops[1][0]
        console.log(`We got ${stop1} ${stop2}`)


        let details = {}
        let stoporders = ["stop1", "stop2"]
        appKey = "c2a002a07d574daaa294449eed950387"

        for (let j in stops) {
            let detail = {"commonName": stops[j][1]}

            requestLink = "https://api.tfl.gov.uk/StopPoint/" + stops[j][0] + "/Arrivals?app_key=" + appKey
            request(requestLink, function (error, response, body) {
                let json = JSON.parse(body);
                let num = json.length       // avoid going out of range
                for (let i = 0; i < Math.min(num, 5); i++) {
                    lineName = json[i]["lineName"]
                    desName = json[i]["destinationName"]
                    time = parseFloat(json[i]["timeToStation"] / 60).toFixed(0)

                    console.log(lineName, desName, time)
                    // detail.push([lineName, desName, time])
                    detail[String(i+1)] = {"lineName": lineName, "desName": desName, "time": time}
                }
                // details.push(detail)
                details[stoporders[j]] = detail
                console.log(details)

                if (Object.keys( details ).length == 2) {
                    resolve(details)
                }
                // so need to resolve WITHIN request to get it out
            })

        }

        // resolve(details)

    })
}

// contains example code, do not use directly
function getInfo(postcode) {
    const runProgram = async () => {
        let lonlat = await postcode2lonlat(postcode);

        let stops = await lonlat2stop(lonlat[0], lonlat[1]);       // lon & lat

        let r = await getStopsDetails(stops)
        console.log(r)
    }
    runProgram();

}