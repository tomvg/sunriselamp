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

test('the job runs immediately if the set time is in the past', () =>
{
  const tenMinutesInms = 10 * 60 * 1000
  const tenMinutesEarlier = new Date(new Date().getTime() - tenMinutesInms)

  const callback = jest.fn()
  const schedule = new Schedule(callback)
  schedule.runAt(tenMinutesEarlier)

  expect(callback).toHaveBeenCalledTimes(1)
})

test('a job will not be run if it is cancelled before the planned time', () => {
  const tenMinutesInms = 10 * 60 * 1000
  const tenMinutesLater = new Date(new Date().getTime() + tenMinutesInms)

  const callback = jest.fn()
  const schedule = new Schedule(callback)
  schedule.runAt(tenMinutesLater)
  schedule.cancel()

  jest.advanceTimersByTime(tenMinutesInms)

  expect(callback).toHaveBeenCalledTimes(0)
})

test('when a job is rescheduled, the old schedule is cancelled', () => {
  const tenMinutesInms = 10 * 60 * 1000
  const fiveMinutesLater = new Date(new Date().getTime() + tenMinutesInms/2)
  const tenMinutesLater = new Date(new Date().getTime() + tenMinutesInms)

  const callback = jest.fn()
  const schedule = new Schedule(callback)
  schedule.runAt(fiveMinutesLater)
  schedule.runAt(tenMinutesLater)

  jest.advanceTimersByTime(tenMinutesInms/2)
  expect(callback).toHaveBeenCalledTimes(0)

  jest.advanceTimersByTime(tenMinutesInms/2)
  expect(callback).toHaveBeenCalledTimes(1)
})
