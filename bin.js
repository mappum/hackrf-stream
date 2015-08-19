#!/usr/bin/env node

var devices = require('./')()
console.log('%d HackRF devices found', devices.length)
if (!devices.length) {
  console.error('No HackRF devices found')
  process.exit(1)
}

var radio = devices.open(0, { closeOnExit: true })
var frequency = +process.argv[2] || 2.485e9
radio.device.setTxGain(40)
radio.device.setLNAGain(40)
radio.device.setVGAGain(40)
radio.device.setBandwidth(5e6, function () {
  radio.device.setFrequency(frequency, function () {
    if (!process.stdin.isTTY) {
      console.error('transmitting at', frequency)
      process.stdin.pipe(radio.createWriteStream())
    } else {
      console.error('receiving at', frequency)
      radio.createReadStream().pipe(process.stdout)
    }
  })
})
