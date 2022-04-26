

// --------------------------- import ------------------------------------
const request = require('request');

here = "490008660N"
// ---------------------------- function ----------------------------------

// next 5 buses at stop code
function nextFive(stopID) {
    appKey = "c2a002a07d574daaa294449eed950387"
    requestLink = "https://api.tfl.gov.uk/StopPoint/"+stopID+"/Arrivals?app_key="+appKey
    request(requestLink, function (error, response, body) {
        let json = JSON.parse(body);
        for (let i = 0; i < 5; i++) {
            console.log(json[i]["lineName"])        // route
            console.log(json[i]["destinationName"])
            console.log(json[i]["timeToStation"]/60)
        }
    })
}
// nextFive(here)

function postcode2lonlat(postcode) {
    requestLink = "https://api.postcodes.io/postcodes/" + postcode
    request(requestLink, function (error, response, body) {

        let json = JSON.parse(body);

        console.log(json["result"]["longitude"])
        console.log(json["result"]["latitude"])

        // cannot return either
    })

}
// postcode2lonlat("SE85EP")

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

// postcode -> stop code in one function
// request inside request for now
function findStopCode(postcode) {
    requestLink = "https://api.postcodes.io/postcodes/" + postcode
    request(requestLink, function (error, response, body) {

        let json = JSON.parse(body);

        lon = json["result"]["longitude"]
        lat = json["result"]["latitude"]

        console.log(lon, lat)

        stoptype = "NaptanPublicBusCoachTram"
        requestLink = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stoptype}`

        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            console.log(`Stop code of closest bus stop to ${postcode} is: ` + json["stopPoints"][0]["naptanId"])

        })
    })
}

findStopCode("SE85EP")