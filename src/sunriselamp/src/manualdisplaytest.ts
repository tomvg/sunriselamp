import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import ConsoleTimeDisplay = require('./consoletimedisplay')
import SegmentDisplay = require('./segmentdisplay')

const clock = new Clock()
const alarm = new AlarmSettings()
const displayDriver = new ConsoleTimeDisplay()

const display = new SegmentDisplay(displayDriver, clock, alarm)

console.log('Enter "c" to show the clock, "a" to thow the alarm time and "x" to exit.')

if(process.stdin.setRawMode) {
  process.stdin.setRawMode(true)
}
else {
  console.log('Raw mode unavailable')
}
process.stdin.setEncoding('ascii')
process.stdin.resume()
process.stdin.on('data', (key) => {
  if(key == 'c') {
    display.showClock()
  }
  if(key == 'a') {
    display.showAlarm()
  }
  if(key == 'x') {
    process.exit(0)
  }
})
