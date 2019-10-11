import TimeAndAlarmDisplay = require('./timeandalarmdisplay')
import TimeDisplay = require('./timedisplay')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')

class MockDriver extends TimeDisplay {
  setDisplay = jest.fn()
  setNoDisplay = jest.fn()
}

test('the display is updated when the alarm time changes', () => {
  const driver = new MockDriver()
  const alarm = new AlarmSettings()
  const display = new TimeAndAlarmDisplay(driver, new Clock(), alarm)
  display.showAlarm()
  alarm.setAlarmTime({hour: 1, minute: 2})
  const driverSetTimeArguments = driver.setDisplay.mock.calls.pop()
  expect(driverSetTimeArguments[0]).toBe(1)
  expect(driverSetTimeArguments[1]).toBe(2)
})

test('the display unsubscribes from the alarm when the display is turned off', () => {
  const driver = new MockDriver()
  const alarm = new AlarmSettings()
  const display = new TimeAndAlarmDisplay(driver, new Clock(), alarm)
  display.showAlarm()
  expect(alarm.isSubscribed(display)).toBe(true)
  display.turnDisplayOff()
  expect(alarm.isSubscribed(display)).toBe(false)
})


test('the display unsubscribes from the clock when the display is turned off', () => {
  const driver = new MockDriver()
  const clock = new Clock()
  const display = new TimeAndAlarmDisplay(driver, clock, new AlarmSettings())
  display.showClock()
  expect(clock.isSubscribed(display)).toBe(true)
  display.turnDisplayOff()
  expect(clock.isSubscribed(display)).toBe(false)
})

test('the display unsubscribes from the current data source when another one is shown', () => {
  const driver = new MockDriver()
  const clock = new Clock()
  const alarm = new AlarmSettings()
  const display = new TimeAndAlarmDisplay(driver, clock, alarm)
  display.showClock()
  expect(clock.isSubscribed(display)).toBe(true)
  expect(alarm.isSubscribed(display)).toBe(false)
  display.showAlarm()
  expect(clock.isSubscribed(display)).toBe(false)
  expect(alarm.isSubscribed(display)).toBe(true)
  display.showClock()
  expect(clock.isSubscribed(display)).toBe(true)
  expect(alarm.isSubscribed(display)).toBe(false)
})


test('the alarm display is turned off again after 10 seconds', (done) => {
  jest.setTimeout(15000); // increase the timeout for this test
  const driver = new MockDriver()
  const display = new TimeAndAlarmDisplay(driver, new Clock(), new AlarmSettings())
  expect(driver.setNoDisplay.mock.calls.length).toBe(0)
  display.showAlarm()
  setTimeout(() => {
    expect(driver.setNoDisplay.mock.calls.length).toBe(1)
    done()
  }, 10500)
})

test('the clock display is turned off again after 10 seconds', (done) => {
  jest.setTimeout(15000); // increase the timeout for this test
  const driver = new MockDriver()
  const display = new TimeAndAlarmDisplay(driver, new Clock(), new AlarmSettings())
  expect(driver.setNoDisplay.mock.calls.length).toBe(0)
  display.showClock()
  setTimeout(() => {
    expect(driver.setNoDisplay.mock.calls.length).toBe(1)
    done()
  }, 10500)
})

test('the separator sign blinks when the alarm is displayed', (done) => {
  const driver = new MockDriver()
  const display = new TimeAndAlarmDisplay(driver, new Clock(), new AlarmSettings())
  display.showAlarm()
  //Test that the separator symbol has been alternating for some seconds
  setTimeout(() => {
    let separatorValue = !driver.setDisplay.mock.calls[0][2]
    for (const fCall of driver.setDisplay.mock.calls) {
      expect(fCall[2]).toBe(!separatorValue)
      separatorValue = fCall[2]
    }
    done()
  }, 3000)
})
