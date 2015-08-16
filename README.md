# hackrf-stream
A stream interface to receive and transmit on a HackRF radio

```
npm install hackrf-stream
```

## API

```js
var radio = require('hackrf-stream')()
var rx = radio.createReadStream()
var tx = radio.createWriteStream()

radio.setFrequency(2.55e9)

rx.on('data', function (chunk) {
  tx.write(chunk)
})
```

### `var radio = require('hackrf-stream')()`
Returns the first device found

### `radio.createReadStream()`
Returns a readable stream which emits raw sample data received by the radio.

### `radio.createWriteStream()`
Returns a writable steam for transmitting data.

The HackRF cannot transmit and receive simultaneously, so while data is being written, read streams returned by `createReadStream` will not emit anything.

### `radio.setFrequency(freq_hz, [callback])`
Set the center frequency for both receiving and transmitting.

### `radio.setSampleRate(rate_Mhz, [callback])`
Set the number of samples per second for both receiving and transmitting. The rate must be one of the following: `8, 10, 12.5, 16, 20`.

### `radio.setBandwidth(bw_Mhz, [callback])`
Set the filter bandwidth (this makes so data we receive only includes signals within a certain range of the frequency passed to `setFrequency`). The bandwidth must be one of the following: `1.75, 2.5, 3.5, 5, 5.5, 6, 7, 8, 9, 10, 12, 14, 15, 20, 24, 28`.

### `radio.device`
A handle to the underlying device returned by the `hackrf` package. See the [hackrf module's README](https://github.com/mappum/node-hackrf/blob/master/README.md) for documentation about the device's API.
