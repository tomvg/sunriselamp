import View = require('./view')
import Clock = require('./clock')

class ClockPrinter extends View {
  private clock: Clock

  constructor(clock: Clock) {
    super()
    this.clock = clock;
    clock.subscribe(this)
  }

  public notify() {
    const time = this.clock.getCurrentTime()
    console.log(time.toTimeString())
  }
}

export = ClockPrinter
