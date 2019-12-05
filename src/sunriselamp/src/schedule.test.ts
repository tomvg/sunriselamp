jest.useFakeTimers()

import Schedule = require('./schedule')

test('run a function at a given time in the future', () => {
  const tenMinutesInms = 10 * 60 * 1000
  const tenMinutesLater = new Date(new Date().getTime() + tenMinutesInms)

  const callback = jest.fn()
  const schedule = new Schedule(callback)
  schedule.runAt(tenMinutesLater)

  jest.advanceTimersByTime(tenMinutesInms)

  expect(callback).toHaveBeenCalledTimes(1)
})
