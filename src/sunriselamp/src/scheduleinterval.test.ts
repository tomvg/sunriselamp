jest.useFakeTimers()

import ScheduleInterval = require('./scheduleinterval')

test('performs a job every minute in a given interval in the future, including start and end time', () => 
{
    const minuteInMs = 60000
    const tenMinutesLater = new Date(new Date().getTime() + 10 * minuteInMs)
    const twentyMinutesLater = new Date(new Date().getTime() + 20 * minuteInMs)
    const callback = jest.fn()
    const scheduleInterval = new ScheduleInterval(callback)
    scheduleInterval.runAt(minuteInMs, tenMinutesLater, twentyMinutesLater)

    // advance to 5 minutes before start time
    jest.advanceTimersByTime(5 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(0)

    // advance to start time
    jest.advanceTimersByTime(5 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(1)

    // advance to start time + 1 minute
    jest.advanceTimersByTime(1 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(2)

    // advance to end time - 1 minute
    jest.advanceTimersByTime(8 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(10)

    // just past end time
    jest.advanceTimersByTime(1.1 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(11)

    // advance 5 minutes past end time
    jest.advanceTimersByTime(1 * minuteInMs)
    expect(callback).toHaveBeenCalledTimes(11)
})