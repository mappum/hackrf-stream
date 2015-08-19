# hackrf-stream
A stream interface to receive and transmit on a HackRF radio

```
npm install hackrf-stream
```

## API

```js
// get a list of devices
var devices = require('hackrf-stream')()
// open the first device
var radio = devices.open(0)
// create a readable stream for receiving
var rx = radio.createReadStream()
// create a writable stream for transmitting
var tx = radio.createWriteStream()

// tune to the frequency we want to send/receive on
radio.setFrequency(2.55e9)

// transmit input taken from stdin
process.stdin.pipe(tx)
// pipe received data to stdout
rx.pipe(process.stdout)
```

### `var devices = require('hackrf-stream')()`
Returns an array containing information about the connected HackRF devices. If no devices are found, an empty array is returned.

### `var radio = devices.open(deviceIndex, [opts])`
Opens the device with index `deviceIndex`, using the specified options (if any).
Available options for `opts`:

  * `closeOnExit` - if `true`, the radio will automatically be closed on `process.exit` or `SIGINT` (Ctrl-C)

Note that the device will continue transmitting after your program terminates, unless you use the `closeOnExit` option or manually call `radio.close`.

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

### `radio.close([callback])`
Stops receiving and transmitting, and releases the device so it may be used by other processes.

### `radio.device`
A handle to the underlying device returned by the `hackrf` package. See the [hackrf module's README](https://github.com/mappum/node-hackrf/blob/master/README.md) for documentation about the device's API.
