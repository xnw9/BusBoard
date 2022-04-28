const express = require('express')
const app = express()
const port = 3000

here = "SE8 5EP"

const request = require('request');

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

// need to be in front of everything
app.use(express.static('frontend'));

// TODO: add reject / get reject / if reject, raise 400 bad request
app.get("/board", (req, res) => {
    // JSON result is visible from the browser
    // route parameter: /board
    // query parameter: ?para=parameter

    const runProgram = async () => {
        let postcode = req.query["postcode"]

        let lonlat = await postcode2lonlat(postcode);

        let stops = await lonlat2stop(lonlat[0], lonlat[1]);

        let r = await getStopsDetails(stops)

        console.log(r)
        res.send(r)
    }
    runProgram();

})
app.use('/history', express.static('frontend/history.html'))

// TODO: import promises from p1.js instead

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



