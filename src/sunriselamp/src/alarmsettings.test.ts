import AlarmSettings = require('./alarmsettings')
import View = require('./view')
import { networkInterfaces } from 'os'

class MockView extends View {
  notify = jest.fn()
}

test('notified when alarm time changes', () => {
  const alarmSettings = new AlarmSettings()
  const view = new MockView()

  alarmSettings.subscribe(view)
  alarmSettings.setAlarmTime({hour: 10, minute: 5})
  expect(view.notify.mock.calls.length).toBe(2)
  // Also notified when alarm time is set to the same time:
  alarmSettings.setAlarmTime({hour: 10, minute: 5})
  expect(view.notify.mock.calls.length).toBe(3)
})

test('notified when alarm is enabled/disabled', () => {
  const alarmSettings = new AlarmSettings()
  const view = new MockView()

  alarmSettings.subscribe(view)
  // Even when it was already disabled:
  alarmSettings.disableAlarm()
  expect(view.notify.mock.calls.length).toBe(2)

  alarmSettings.enableAlarm()
  expect(view.notify.mock.calls.length).toBe(3)
})

test('time is set correctly', () => {
  const alarmSettings = new AlarmSettings()

  alarmSettings.setAlarmTime({hour: 10, minute: 5})
  const time = alarmSettings.getAlarmTime()

  expect(time.hour).toBe(10)
  expect(time.minute).toBe(5)
})

test('alarm is enabled and disabled correctly', () => {
  const alarmSettings = new AlarmSettings()

  expect(alarmSettings.isEnabled()).toBe(false)
  alarmSettings.enableAlarm()
  expect(alarmSettings.isEnabled()).toBe(true)
  alarmSettings.disableAlarm()
  expect(alarmSettings.isEnabled()).toBe(false)
})

test('throws on incorrect time', () => {
  const alarmSettings = new AlarmSettings()

  expect(() => alarmSettings.setAlarmTime({hour: 24, minute: 0})).toThrow()
  expect(() => alarmSettings.setAlarmTime({hour: 0, minute: 60})).toThrow()
  expect(() => alarmSettings.setAlarmTime({hour: -1, minute: -1})).toThrow()
})

test('gets the alarm for the next day if todays has already passed', () => {
  const alarmSettings = new AlarmSettings()

  alarmSettings.setAlarmTime({hour: 0, minute: 0})
  const now = new Date()
  const alarmDate = alarmSettings.getAlarmDateTime()
  expect(alarmDate.getDay()).not.toBe(now.getDay())
})

test('gets the alarm for today if todays has not already passed', () => {
  const alarmSettings = new AlarmSettings()

  alarmSettings.setAlarmTime({hour: 23, minute: 59})
  const now = new Date()
  const alarmDate = alarmSettings.getAlarmDateTime()
  expect(alarmDate.getDay()).toBe(now.getDay())
})

export = AlarmSettings
