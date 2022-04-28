// -------------------------- websites ---------------------------------
/*
https://techforum.tfl.gov.uk/t/stoppoint-types/958/2
*/

// --------------------------- import ------------------------------------
const request = require('request');

here = "SW7 4BE"
// ---------------------------- example function ----------------------------------
// contains code that could be used elsewhere but the function itself cannot be called directly

// next 5 buses at stop code
function nextFive(stopID) {
    appKey = "c2a002a07d574daaa294449eed950387"
    requestLink = "https://api.tfl.gov.uk/StopPoint/" + stopID + "/Arrivals?app_key=" + appKey
    request(requestLink, function (error, response, body) {
        let json = JSON.parse(body);
        for (let i = 0; i < 5; i++) {
            console.log(json[i]["lineName"])        // route
            console.log(json[i]["destinationName"])
            console.log(json[i]["timeToStation"] / 60)
        }
    })
}

// nextFive(here)

function findlonlat(postcode) {
    requestLink = "https://api.postcodes.io/postcodes/" + postcode
    request(requestLink, function (error, response, body) {

        let json = JSON.parse(body);

        console.log(json["result"]["longitude"])
        console.log(json["result"]["latitude"])

        // cannot return either
    })

}

//findlonlat("SE85EP")

function findStop(lat, lon) {
    stoptype = "NaptanPublicBusCoachTram"
    requestLink = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stoptype}`
    console.log(requestLink)
    request(requestLink, function (error, response, body) {

        let json = JSON.parse(body);

        console.log(json["stopPoints"][0]["commonName"])
        console.log(json["stopPoints"][0]["naptanId"])

    })

}

// findStop(51.491035, -0.038207)

// postcode -> stop code in one function, request inside request for now
function findStopCodeR(postcode) {
    requestLink = "https://api.postcodes.io/postcodes/" + postcode
    request(requestLink, function (error, response, body) {

        let json = JSON.parse(body);

        lon = json["result"]["longitude"]
        lat = json["result"]["latitude"]

        console.log(lon, lat)

        stoptype = "NaptanPublicBusCoachTram"
        // set radius to 500 so that there must be a second closest stop in the list
        requestLink = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stoptype}&radius=500`

        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            console.log(`Stop code of the 1st closest bus stop to ${postcode} is: \n` + json["stopPoints"][0]["naptanId"])
            console.log(`Stop code of the 2nd closest bus stop to ${postcode} is: \n` + json["stopPoints"][0]["naptanId"])
        })
    })
}

// findStopCodeR("SE85EP")

// ------------------------------- promises -----------------------------------
// that are actually useful

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

// postcode2lonlat("SE85EP")

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

// change to JSON here
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

                    detail[String(i+1)] = {"lineName": lineName, "desName": desName, "time": time}
                }

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

// --------------------------------- testing ------------------------------
const runProgram = async () => {
    let lonlat = await postcode2lonlat(here);

    let stops = await lonlat2stop(lonlat[0], lonlat[1]);       // lon & lat

    let r = await getStopsDetails(stops)
    console.log(r)
}
runProgram();

// export, to be used in app.js
module.exports = {postcode2lonlat, lonlat2stop, getStopsDetails};