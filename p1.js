// -------------------------- websites ---------------------------------
/*
https://techforum.tfl.gov.uk/t/stoppoint-types/958/2
*/

// --------------------------- import ------------------------------------
const request = require('request');

here = "SW7 4BE"

// ------------------------------ class -----------------------------------
class Stop {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

// ------------------------------- promises -----------------------------------
// that are actually useful

function postcode2lonlat(postcode) {
    return new Promise((resolve, reject) => {
        if (postcode.includes(" ")) {
            postcode = postcode.replace(" ", "")
        }
        const requestLink = "https://api.postcodes.io/postcodes/" + postcode
        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            const status = json["status"]
            if (status != 200) {
                console.log("invalid")
                // TODO: what after reject?
                reject(Error("Invalid postcode"))
            }

            const lon = json["result"]["longitude"]
            const lat = json["result"]["latitude"]

            resolve([lon, lat])

        })
    })
}

// postcode2lonlat("SE85EP")

function lonlat2stop(lon, lat) {
    return new Promise((resolve) => {
        stoptype = "NaptanPublicBusCoachTram"
        const requestLink = `https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=${stoptype}&radius=500`
        console.log(requestLink)
        request(requestLink, function (error, response, body) {

            let json = JSON.parse(body);

            // let stop1 = [json["stopPoints"][0]["naptanId"], json["stopPoints"][0]["commonName"]]
            // let stop2 = [json["stopPoints"][1]["naptanId"], json["stopPoints"][1]["commonName"]]
            let stop1 = new Stop(json["stopPoints"][0]["naptanId"], json["stopPoints"][0]["commonName"])
            let stop2 = new Stop(json["stopPoints"][1]["naptanId"], json["stopPoints"][1]["commonName"])

            resolve([stop1, stop2])

        })

    })
}

// lonlat2stop(-0.038207, 51.491035)

// change to JSON here
function getStopsDetails(stops) {
    return new Promise((resolve) => {
        stop1 = stops[0].id
        stop2 = stops[1].id
        // console.log(`We got ${stop1} ${stop2}`)

        let details = {}
        let stoporders = ["stop1", "stop2"]
        const appKey = "c2a002a07d574daaa294449eed950387"

        for (let j in stops) {
            let detail = {"commonName": stops[j].name}

            const requestLink = "https://api.tfl.gov.uk/StopPoint/" + stops[j].id + "/Arrivals?app_key=" + appKey
            request(requestLink, function (error, response, body) {
                let json = JSON.parse(body);
                let num = json.length       // avoid going out of range
                for (let i = 0; i < Math.min(num, 5); i++) {
                    lineName = json[i]["lineName"]
                    desName = json[i]["destinationName"]
                    time = parseFloat(json[i]["timeToStation"] / 60).toFixed(0)

                    detail[String(i+1)] = {"lineName": lineName, "desName": desName, "time": time}
                }

                details[stoporders[j]] = detail

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
/*

const runProgram = async () => {
    let lonlat = await postcode2lonlat(here);

    let stops = await lonlat2stop(lonlat[0], lonlat[1]);       // lon & lat

    let r = await getStopsDetails(stops)
    console.log(r)
}
runProgram();
*/

// export, to be used in app.js
module.exports = {postcode2lonlat, lonlat2stop, getStopsDetails};
