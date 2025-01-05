const express = require('express')
const cors = require('cors')
const DeviceDetector = require('node-device-detector')
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// set to false to run locally without ads
const flags = {
    SECRETS: true,
}

let detector = new DeviceDetector()
let secretManager = flags.SECRETS ? new SecretManagerServiceClient() : null

async function accessSecretVersion() {
    const [version] = await secretManager?.accessSecretVersion({
        name: `projects/user-agent-analyzer/secrets/AD_KEY/versions/latest`,
    })
    return version.payload.data.toString()
}

app.get('/', (_, res) => {
    res.sendFile('public/index.html', {root: __dirname})
})

app.get('/config', async (_, res) => {
    try {
        const key = await accessSecretVersion()
        res.json({ key })
    } catch (error) {
        res.send(500).json(error)
    }
})

app.post('/device', (req, res) => {
    let detectedAgent = detector.detect(req.body.userAgent)
    console.log(detectedAgent)
    res.json({
        type: detectedAgent.device.type ?? 'Unknown Device Type',
        brand: detectedAgent.device.brand,
        model: detectedAgent.device.model ?? 'Unknown',
        osName: detectedAgent.os.name ?? 'Unknown OS',
        osVersion: detectedAgent.os.version,
        clientType: detectedAgent.client.type ?? 'Unknown Client Type',
        clientName: detectedAgent.client.name ?? 'Unknown Client',
        clientVersion: detectedAgent.client.version,
    })
})

app.listen(process.env.PORT || 3000)