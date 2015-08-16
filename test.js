var radio = require('./')()

radio.device.setFrequency(2.4e9, function () {
  radio.device.setBandwidth(10e6, function () {
    var rx = radio.createReadStream()
    var tx = radio.createWriteStream()

    rx.on('data', function (chunk) {
      console.log('received:', chunk)
    })
    setInterval(function () {
      console.log('transmitting')
      tx.write(new Buffer(5e6))
    }, 1000)
  })
})

radio.on('startrx', function () { console.log('started rx') })
radio.on('starttx', function () { console.log('started TX') })
radio.on('endrx', function () { console.log('ended rx') })
radio.on('endtx', function () { console.log('ended TX') })
