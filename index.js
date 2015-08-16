var events = require('events')
var stream = require('stream')
var util = require('util')
var hackrf = require('hackrf')

// TODO: device selection
module.exports = function () {
  return new Radio(hackrf())
}

var Radio = function (device) {
  if (!(this instanceof Radio)) {
    return new Radio(device)
  }

  this.device = device
  this.rx = null
  this.tx = null
  this.receiving = false
  this.transmitting = false

  this.setFrequency = device.setFrequency
  this.setSampleRate = device.setSampleRate
  this.setBandwidth = device.setBandwidth
}
util.inherits(Radio, events.EventEmitter)

Radio.prototype.createReadStream = function () {
  if (this.rx) return this.rx
  this.rx = new RxStream(this)
  return this.rx
}

Radio.prototype.createWriteStream = function () {
  if (this.tx) return this.tx
  this.tx = new TxStream(this)
  return this.tx
}

Radio.prototype._stopRx = function (cb) {
  var self = this
  if (!this.receiving) return cb(new Error('Not receiving'))
  this.device.stopRx(function () {
    self.receiving = false
    self.emit('endrx')
    if (cb) cb()
  })
}

Radio.prototype._stopTx = function (cb) {
  var self = this
  if (!this.transmitting) return cb(new Error('Not transmitting'))
  this.device.stopTx(function () {
    self.transmitting = false
    self.emit('endtx')
    if (cb) cb()
  })
}

function RxStream (radio) {
  stream.Readable.call(this)
  this.radio = radio
  this.device = radio.device
}
util.inherits(RxStream, stream.Readable)

RxStream.prototype._read = function () {
  this._rx()
}

RxStream.prototype._rx = function () {
  var self = this

  if (this.radio.receiving) return
  if (this.radio.transmitting) {
    this.radio.once('endtx', this._rx.bind(this))
    return
  }

  this.radio.receiving = true
  this.radio.emit('startrx')
  this.device.startRx(function (data, done) {
    var res = self.push(data)
    if (!res) self.radio._stopRx()
    done()
  })
}

function TxStream (radio) {
  stream.Writable.call(this)
  this.radio = radio
  this.device = radio.device
}
util.inherits(TxStream, stream.Writable)

TxStream.prototype._write = function (input, encoding, cb) {
  this._tx(input, encoding, cb)
}

TxStream.prototype._tx = function (input, encoding, cb, resume) {
  var self = this

  if (this.radio.receiving) {
    this.radio._stopRx(function () {
      self._tx(input, encoding, cb, true)
    })
    return
  }

  this.radio.transmitting = true
  this.radio.emit('starttx')
  this.device.startTx(function (output, done) {
    if (input.length === 0) return done()
    output = output.slice(self.offset)
    input.copy(output)
    output.fill(0, input.length)
    input = input.slice(output.length)
    done()

    if (input.length) return

    self.radio._stopTx(function () {
      if (resume) self.radio.rx._rx()
      cb()
    })
  })
}
