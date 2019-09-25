import TimeDisplay = require('./timedisplay')
import LedDisplayDriver = require('./leddisplaydriver')
import Jimp from 'jimp'
import {Font} from 'jimp'

class LedTimeDisplay extends TimeDisplay {
  private ledDisplay: LedDisplayDriver
  private font: Font | undefined // Allow undefined so that font can be initialised later
  private width: number
  private height: number

  constructor(ledDisplay: LedDisplayDriver, fontLocation: string = 'sunrise-font/sunrise-font.fnt') {
    super()
    this.ledDisplay = ledDisplay
    this.width = ledDisplay.getWidth()
    this.height = ledDisplay.getHeight()
    Jimp.loadFont(fontLocation).then(font => this.font = font)
  }

  // Set the display if blinkUp is true and the font has been loaded.
  setDisplay(hour: number, minute: number, blinkUp: boolean) {
    if(blinkUp && this.font !== undefined) {
      this.printTime(hour, minute)
    }
    else {
      this.turnDisplayOff()
    }
  }

  turnDisplayOff() {
    //this.ledDisplay.write(Buffer.alloc(this.width * this.height * 4, 0))
  }

  private async printTime(hour: number, minute: number) {
    const image = await new Jimp(this.width, this.height)
    image.print(
      <Font> this.font,
      0,
      -this.height,
    {
      text: hour.toString(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    },
    this.width,
    this.height)

    image.print(
      <Font> this.font,
      0,
      1,
    {
      text: minute.toString(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    this.width,
    this.height)

    this.ledDisplay.write(image.bitmap.data);
  }
}

export = LedTimeDisplay
