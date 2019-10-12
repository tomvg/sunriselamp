import Data = require('./data')

interface Time {hour: number, minute: number}

/* Keeps settings for the alarm and notifies observers on changes. */
class AlarmSettings extends Data {
  time: Time = {hour: 0, minute: 0}
  alarmEnabled: boolean = false

  setAlarmTime(time: Time): void {
    if(time.hour < 0 || time.hour > 23 || time.minute < 0 || time.minute > 59) {
      throw new Error(`Invalid time specified: ${time.hour}:${time.minute}`)
    }
    this.time = {hour: time.hour, minute: time.minute}
    this.notifyChangeToSubscribers()
  }

  getAlarmTime() : Time {
    return this.time
  }

  getAlarmDate(): Date {
    const dateNow = new Date()
    const alarmDate = new Date(dateNow)
    const alarmTime = this.getAlarmTime()
    alarmDate.setHours(alarmTime.hour, alarmTime.minute, 0, 0)
    if(dateNow > alarmDate) {
      alarmDate.setHours(alarmTime.hour + 24)
    }
    return alarmDate
  }

  enableAlarm(): void {
    this.alarmEnabled = true
    this.notifyChangeToSubscribers()
  }

  disableAlarm(): void {
    this.alarmEnabled = false
    this.notifyChangeToSubscribers()
  }

  enabled(): boolean {
    return this.alarmEnabled
  }
}

export = AlarmSettings
