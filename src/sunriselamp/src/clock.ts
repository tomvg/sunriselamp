import Data = require('./data')

/* Notifies all subscribers every minute. Only sets timers when there
   are any subscribers. */
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

  private notifyAndSetTimer = () => {
    this.notifyChangeToSubscribers()
    this.runAtNextWholeMinute(this.notifyAndSetTimer)
  }

  protected onFirstSubscriber() {
    this.runAtNextWholeMinute(this.notifyAndSetTimer)
  }

  protected onNoMoreSubscribers() {
    clearTimeout(this.notifyTimer)
  }
}

export = Clock
