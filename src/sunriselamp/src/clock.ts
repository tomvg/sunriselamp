import Data = require('./data')

/* Notifies all subscribers every minute */
class Clock extends Data {
  private notifyTimer: NodeJS.Timeout = {} as NodeJS.Timeout

  public getCurrentTime(): Date {
    return new Date()
  }

  private runAtNextWholeMinute(fn: () => void) : void {
    const now = new Date()
    const timeout = 1000*(60 - now.getSeconds()) + 1000 - now.getMilliseconds()
    this.notifyTimer = setTimeout(fn, timeout)
  }

  private notifyAndSetTimer() {
    this.notifyChangeToSubscribers()
    this.runAtNextWholeMinute(this.notifyAndSetTimer)
  }

  private onFirstSubscriber() {
    this.notifyAndSetTimer()
  }

  private onNoMoreSubscribers() {
    clearTimeout(this.notifyTimer)
  }
}
