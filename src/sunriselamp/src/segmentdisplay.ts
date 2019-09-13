import SegmentDisplayDriver = require('./segmentdisplaydriver')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import View = require('./view')
import Data = require('./data')

class SegmentDisplay extends View {
  private driver: SegmentDisplayDriver

  private clock: Clock
  private alarm: AlarmSettings
  private currentDatasource: Data

  private displayHour: number = 0
  private displayMinute: number = 0
  private showSeparator: boolean = true

  private displayIsOn: boolean = false
  private displayTimer: NodeJS.Timeout = {} as NodeJS.Timeout
  private displayTimeout = 10000

  private blinkTimer: NodeJS.Timeout = {} as NodeJS.Timeout
  private blinkTimeout = 500
  private blinkingIsOn = false

  constructor(driver: SegmentDisplayDriver, clock: Clock, alarm: AlarmSettings) {
    super()
    this.driver = driver
    this.clock = clock;
    this.alarm = alarm;
    this.currentDatasource = clock
  }

  public showAlarm (): void {
    this.notify = this.updateWithAlarmTime
    if(this.currentDatasource != this.alarm) {
      this.currentDatasource.unsubscribe(this)
      this.currentDatasource = this.alarm
    }
    this.currentDatasource.subscribe(this)
    this.turnDisplayOn()
    this.turnBlinkingOn()
  }


  public showClock (): void {
    this.notify = this.updateWithClockTime
    if(this.currentDatasource != this.clock) {
      this.currentDatasource.unsubscribe(this)
      this.currentDatasource = this.clock
    }
    this.currentDatasource.subscribe(this)
    this.turnDisplayOn()
    this.turnBlinkingOff()
  }

  private updateWithAlarmTime(): void {
    const now = this.alarm.getAlarmTime()
    this.displayHour = now.hour
    this.displayMinute = now.minute
    this.refreshDisplay()
  }

  private updateWithClockTime(): void {
    const now = this.clock.getCurrentTime()
    this.displayHour = now.getHours()
    this.displayMinute = now.getMinutes()
    this.refreshDisplay()
  }

  private turnDisplayOn(): void {
    // If already on, just reset the timeout
    if(this.displayIsOn) {
      clearTimeout(this.displayTimer)
      this.displayTimer = setTimeout(() => this.turnDisplayOff(), this.displayTimeout)
    }
    else {
      this.displayIsOn = true
      this.driver.setDisplay(this.displayHour, this.displayMinute, this.showSeparator)
      this.displayTimer = setTimeout(() => this.turnDisplayOff(), this.displayTimeout)
    }
  }

  public turnDisplayOff() {
    if(this.displayIsOn) {
      this.currentDatasource.unsubscribe(this)
      clearTimeout(this.displayTimer)
      this.displayIsOn = false
      this.driver.turnDisplayOff()
      this.turnBlinkingOff()
    }
  }

  private turnBlinkingOn() {
    if(!this.blinkingIsOn) {
      this.blinkingIsOn = true
      this.blinkTimer = setInterval(() => {
        this.showSeparator = !this.showSeparator
        this.refreshDisplay()
      }, this.blinkTimeout)
    }
  }

  private turnBlinkingOff() {
    if(this.blinkingIsOn) {
      this.blinkingIsOn = false
      clearInterval(this.blinkTimer)
      this.showSeparator = true
      this.refreshDisplay()
    }
  }

  private refreshDisplay() {
    if(this.displayIsOn) {
      this.driver.setDisplay(this.displayHour, this.displayMinute, this.showSeparator)
    }
  }

  notify() {}
}

export = SegmentDisplay
