import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import LedTimeDisplay = require('./ledtimedisplay')
import TimeAndAlarmDisplay = require('./timeandalarmdisplay')
import LedDisplayDriver = require('./leddisplaydriver')
import Sk9822Driver = require('./sk9822driver')



const clock = new Clock()
const alarm = new AlarmSettings()
const ledDisplay = new LedDisplayDriver(new Sk9822Driver(7*13), 0, 7, 13)
const timeDisplay = new LedTimeDisplay(ledDisplay)

const display = new TimeAndAlarmDisplay(timeDisplay, clock, alarm)

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
