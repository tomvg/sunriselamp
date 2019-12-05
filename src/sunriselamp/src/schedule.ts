class Schedule {
  private callback: () => void
  private timeout: NodeJS.Timeout | null

  constructor(callback = () => {}) {
    this.callback = callback
    this.timeout = null
  }

  public runAt(plannedDateTime: Date) {
    const plannedTime = plannedDateTime.getTime()
    const now = new Date().getTime()

    //this.timeout = setTimeout(this.callback, plannedTime - now)
  }
}

export = Schedule
