const textarea = document.querySelector('textarea')
const detectButton = document.querySelector('#detect')
const deviceTxt = document.querySelector('#device')
const clientTxt = document.querySelector('#client')

detectButton.addEventListener('click', () => {
    const reqData = {
        userAgent: textarea.value 
    }
    const reqOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reqData)
    }
    fetch('/device', reqOptions)
        .then(res => res.json())
        .then(res => {
            deviceTxt.textContent = `${res.type} - ${res.brand} ${res.model} (${res.osName} ${res.osVersion})`
            clientTxt.textContent = `${res.clientType} - ${res.clientName} ${res.clientVersion}`
        })
})