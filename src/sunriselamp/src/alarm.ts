import View = require('./view')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import SunriseAnimation = require('./sunriseanimation')
import schedule = require('node-schedule')

class Alarm extends View {
    private alarmSettings: AlarmSettings
    private sunrise: SunriseAnimation

    private alarmEnabled: boolean = false
    private ringTimer: schedule.Job = {} as schedule.Job
    private sunriseTimer: schedule.Job = {} as schedule.Job

    constructor(alarmSettings: AlarmSettings, sunrise: SunriseAnimation) {
        super()
        this.alarmSettings = alarmSettings
        this.sunrise = sunrise

        alarmSettings.subscribe(this)
    }

    public notify(): void {
      // Always cancel the current alarm when there is a configuration change
      if(this.alarmEnabled) {
        this.cancelTimers()
        this.alarmEnabled = false;
      }

      if(this.alarmSettings.isEnabled()) {
        this.enableAlarm()
        this.alarmEnabled = true;
      }
    }

    private cancelTimers(): void {
      this.ringTimer.cancel();
      this.sunriseTimer.cancel();
    }

    private enableAlarm(): void {
      const alarmDate = this.alarmSettings.getAlarmDateTime()
      const sunriseDurationInMS = this.alarmSettings.GetSunriseDurationInMS()
      const sunriseStartDate = new Date(alarmDate.getTime() - sunriseDurationInMS)

      this.ringTimer = schedule.scheduleJob(alarmDate, () => this.ringAlarm())
      this.sunriseTimer = schedule.scheduleJob({
        start: sunriseStartDate,
        end: alarmDate,
        rule: '/10 * * * * * *' // every 10 seconds (cron notation)
      }, () => this.updateSunrise())
      this.updateSunrise()
    }

    private ringAlarm(): void {
      this.sunriseTimer.cancel()
      this.sunrise.setBrightness(1)
      //TODO make a sound
    }

    /**
     * Set the sunrise to the correct ratio. Sets is to 0 if the sunrise
     * has not started yet. Sets it to 1 if the alarm time has already passed.
     */
    private updateSunrise(): void {
      const alarmDate = this.alarmSettings.getAlarmDateTime()
      const sunriseDurationInMS = this.alarmSettings.GetSunriseDurationInMS()
      const nowDate = new Date()
      let sunriseRatio = 1 - (alarmDate.getTime() - nowDate.getTime()) / sunriseDurationInMS
      if(sunriseRatio > 1) {
        sunriseRatio = 1
      }
      if(sunriseRatio < 0) {
        sunriseRatio = 0
      }
      console.log(sunriseRatio)
      this.sunrise.setBrightness(sunriseRatio)
    }
}

export = Alarm
