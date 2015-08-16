var radio = require('./')({ closeOnExit: true })

radio.device.setFrequency(2.4e9, function () {
  radio.device.setBandwidth(10e6, function () {
    var rx = radio.createReadStream()
    var tx = radio.createWriteStream()

    process.stdin.pipe(tx)
    rx.pipe(process.stdout)
  })
})

radio.on('startrx', function () { console.log('started rx') })
radio.on('starttx', function () { console.log('started TX') })
radio.on('endrx', function () { console.log('ended rx') })
radio.on('endtx', function () { console.log('ended TX') })
