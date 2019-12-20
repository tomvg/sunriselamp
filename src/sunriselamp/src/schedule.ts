class Schedule {
  private callback: () => void
  private timeout: NodeJS.Timeout | null

  constructor(callback = () => {}) {
    this.callback = callback
    this.timeout = null
  }

  public runAt(plannedDateTime: Date) {
    this.cancel()
    const plannedTime = plannedDateTime.getTime()
    const now = new Date().getTime()

    const waitTime = plannedTime - now
    if(waitTime <= 0) {
      this.callback()
    }
    else {
      this.timeout = setTimeout(this.callback, waitTime)
    }
  }

  public cancel() {
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}

export = Schedule
