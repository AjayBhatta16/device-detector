const express = require('express')
const cors = require('cors')
const DeviceDetector = require('node-device-detector')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

let detector = new DeviceDetector()

app.get('/', (_, res) => {
    res.sendFile('public/index.html', {root: __dirname})
})

app.post('/device', (req, res) => {
    let detectedAgent = detector.detect(req.body.userAgent)
    console.log(detectedAgent)
    res.json({
        type: detectedAgent.device.type,
        brand: detectedAgent.device.brand,
        model: detectedAgent.device.model,
        osName: detectedAgent.os.name,
        osVersion: detectedAgent.os.version,
        clientType: detectedAgent.client.type,
        clientName: detectedAgent.client.name,
        clientVersion: detectedAgent.client.version,
    })
})

app.listen(process.env.PORT || 3000)