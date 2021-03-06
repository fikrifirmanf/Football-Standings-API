const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const scrapper = require('./scrapper')
const PORT = process.env.PORT || 3000
// const config = require("./config.json")

app.use(helmet())
app.use(cors());

app.get("/", (req, res) => {
    res.send('Football Standings API')
})
app.get("/api/", (req, res) => {

    const footballStand = new Promise((resolve, reject) => {
        scrapper
            .scrapeLeague(req.query.league)
            .then(data => {
                resolve(data)
            })
            .catch(err => reject({message: `Error! ${err}`}))
    })
    // let queryData = req.query.league
    Promise.all([footballStand]).then(data => {
        res.json({
            data: data[0]
        })
    }).catch(err => res.status(500).send(err))
})

app.listen(PORT, () => console.log("Connect to port "+PORT))