import Schedule = require('./schedule')

class ScheduleInterval {
    private callback: () => void
    private endSchedule: Schedule
    private startSchedule: Schedule
    private intervalTimeout: NodeJS.Timeout | null
    private intervalTimeInMs: number = 0

    constructor(callback: () => void) {
        this.callback = callback
        this.endSchedule = new Schedule(this.endJob.bind(this))
        this.startSchedule = new Schedule(this.startJob.bind(this))
        this.intervalTimeout = null
    }

    public runAt(intervalTimeInMs: number, startTime: Date, endTime: Date) {
        if(intervalTimeInMs <= 0) {
            throw new Error("interval must be a number > 0")
        }

        if(startTime >= endTime) {
            throw new Error("Starttime must be earlier than end time")
        }
        if(endTime.getTime() <= Date.now()) {
            throw new Error("End time must be in the future")
        }
        
        this.intervalTimeInMs = intervalTimeInMs
        const timeNow = Date.now()
        let delay = startTime.getTime() - timeNow
        if(delay < 0) {
            delay = this.convertNegativeDelayToPositiveDelay(delay, intervalTimeInMs)
            startTime = new Date(timeNow + delay)
        }

        this.endSchedule.runAt(endTime)
        this.startSchedule.runAt(startTime)
    }

    public cancel() {
        this.endSchedule.cancel()
        if(this.intervalTimeout) {
            clearInterval(this.intervalTimeout)
        }
    }

    private endJob() {
        this.callback()
        this.cancel()
    }

    private startJob() {
        this.callback()
        this.intervalTimeout = setInterval(this.callback, this.intervalTimeInMs)
    }

    // Given a negative delay, advance delay by interval until the first positive number
    private convertNegativeDelayToPositiveDelay(delay: number, interval: number): number {
        return delay + interval * Math.ceil(-delay / interval)
    }
}

export = ScheduleInterval