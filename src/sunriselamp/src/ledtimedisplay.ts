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
    this.ledDisplay.write(Buffer.alloc(this.width * this.height * 4, 0))
  }

  /* I have no idea how the alignment works exactly. I found that these numbers
  work well for a 7 by 13 matrix. */
  private async printTime(hour: number, minute: number) {
    const image = await new Jimp(this.width, this.height, 0x050000ff)
    image.print(
      <Font> this.font,
      -1,
      Math.round(this.height/2),
    {
      text: minute.toString(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    },
    this.width+2,
    this.height+2)

    image.print(
      <Font> this.font,
      -1,
      0,
    {
      text: hour.toString(),
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    },
    this.width+2,
    this.height+2)

    this.ledDisplay.write(image.bitmap.data);
  }
}

export = LedTimeDisplay
