import RectangularDisplay = require('./rectangulardisplay')
import LedTimeDisplay = require('./ledtimedisplay')

class LedTimeDisplayBackground extends RectangularDisplay {
  private timeDisplay: LedTimeDisplay

  constructor(timeDisplay: LedTimeDisplay, display: RectangularDisplay) {
    super(display.getWidth(), display.getHeight())
    this.timeDisplay = timeDisplay
  }

  write(image: Buffer): void {
    this.timeDisplay.setBackground(image)
  }
}

export = RectangularDisplay
