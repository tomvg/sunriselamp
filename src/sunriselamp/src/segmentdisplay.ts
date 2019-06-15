import SegmentDisplayDriver = require('./segmentdisplaydriver')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')
import View = require('./view')
import Data = require('./data')

class SegmentDisplay extends View {
  private driver: SegmentDisplayDriver

  private clock: Clock
  private alarm: AlarmSettings
  private currentDatasource: Data = {} as Data

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
  }

  showAlarm (): void {
    this.notify = this.updateWithAlarmTime
    this.alarm.subscribe(this)
    this.turnDisplayOn()
    this.turnBlinkingOn()
  }

  updateWithAlarmTime(): void {
    const now = this.alarm.getAlarmTime()
    this.displayHour = now.hour
    this.displayMinute = now.minute
    this.refreshDisplay()
  }

  setDisplayTime(hours: number, minutes:number) {
    this.displayDigits[0] = Math.floor(hours / 10)
    this.displayDigits[1] = hours % 10
    this.displayDigits[2] = Math.floor(minutes / 10)
    this.displayDigits[3] = minutes % 10
  }

  turnDisplayOn(): void {
    // If already on, just reset the timeout
    if(this.displayIsOn) {
      this.displayTimer.refresh()
    }
    else {
      this.displayIsOn = true
      this.driver.setDisplay(this.displayHour, this.displayMinute, this.showSeparator)
      this.displayTimer = setTimeout(() => this.turnDisplayOff(), this.displayTimeout)
    }
  }

  turnDisplayOff() {
    if(this.displayIsOn) {
      this.currentDatasource.unsubscribe(this)
      clearTimeout(this.displayTimer)
      this.displayIsOn = false
      this.driver.turnDisplayOff()
      this.turnBlinkingOff()
    }
  }

  turnBlinkingOn() {
    if(!this.blinkingIsOn) {
      this.blinkingIsOn = true
      this.blinkTimer = setInterval(() => {
        this.showSeparator = !this.showSeparator
        this.refreshDisplay()
      }, this.blinkTimeout)
    }
  }

  turnBlinkingOff() {
    if(this.blinkingIsOn) {
      this.blinkingIsOn = false
      clearInterval(this.blinkTimer)
      this.showSeparator = true
      this.refreshDisplay()
    }
  }

  refreshDisplay() {
    if(this.displayIsOn) {
      this.driver.setDisplay(this.displayHour, this.displayMinute, this.showSeparator)
    }
  }

  notify() {}
}

export = SegmentDisplay
