const express = require('express')
const app = express()
const port = 3000

const lib = require("C:/Work/Training/BusBoard/p1");

const request = require('request');

// need to be in front of everything
app.use(express.static('frontend'));

// TODO: add reject / get reject / if reject, raise 400 bad request
app.get("/board", (req, res) => {

    // route parameter: /board
    // query parameter: ?para=parameter

    const runProgram = async () => {
        let postcode = req.query["postcode"]

        let lonlat = await lib.postcode2lonlat(postcode);

        let stops = await lib.lonlat2stop(lonlat[0], lonlat[1]);

        let r = await lib.getStopsDetails(stops)

        console.log(r)
        res.send(r)
    }
    runProgram();

})
app.use('/history', express.static('frontend/history.html'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



