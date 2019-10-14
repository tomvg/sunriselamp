import View = require('./view')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import SunriseAnimation = require('./sunriseanimation')

class Alarm extends View {
    private alarmSettings: AlarmSettings
    private sunrise: SunriseAnimation

    private alarmEnabled: boolean = false
    private ringTimer: NodeJS.Timeout = {} as NodeJS.Timeout
    private sunriseStartTimer: NodeJS.Timeout = {} as NodeJS.Timeout
    private sunriseUpdateTimer: NodeJS.Timeout = {} as NodeJS.Timeout

    constructor(alarmSettings: AlarmSettings, sunrise: SunriseAnimation) {
        super()
        this.alarmSettings = alarmSettings
        this.sunrise = sunrise


        alarmSettings.subscribe(this)
    }

    public notify(): void {
      if(this.alarmEnabled) {
        this.cancelTimers()
      }

      if(this.alarmSettings.enabled()) {
        this.enableAlarm()
      }

    }

    private enableAlarm(): void {
      this.alarmEnabled = true

      const timeNow = (new Date()).getTime()
      const timeOfAlarm = this.alarmSettings.getAlarmDateTime().getTime()
      const sunriseDurationInMS = this.alarmSettings.GetSunriseDurationInMS()
      const timeOfSunriseStart = timeOfAlarm - sunriseDurationInMS

      this.ringTimer = setTimeout(() => this.ringAlarm(), timeOfAlarm - timeNow)
      if(timeOfSunriseStart < timeNow) {
        this.sunriseStartTimer(() => this.startSunrise())
      }

    }

    private ringAlarm(): void {

    }

    private cancelTimers(): void {
      clearTimeout(this.ringTimer)
      clearTimeout(this.sunriseStartTimer)
      clearTimeout(this.sunriseUpdateTimer)
    }
}
