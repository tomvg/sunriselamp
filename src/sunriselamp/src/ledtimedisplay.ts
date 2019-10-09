import TimeDisplay = require('./timedisplay')
import RectangularDisplay = require('./rectangulardisplay')
import Jimp from 'jimp'
import {Font} from 'jimp'

class LedTimeDisplay extends TimeDisplay {
  private ledDisplay: RectangularDisplay
  private font: Font | undefined // Allow undefined so that font can be initialised later
  private width: number
  private height: number
  private background: Buffer

  constructor(ledDisplay: RectangularDisplay, fontLocation: string = 'sunrise-font/sunrise-font.fnt') {
    super()
    this.ledDisplay = ledDisplay
    this.width = ledDisplay.getWidth()
    this.height = ledDisplay.getHeight()
    this.background = Buffer.alloc(this.width*this.height*4)
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

  setBackground(image: Buffer): void {
    if(image.length !== this.width*this.height*4) {
      throw("Wrong image size given")
    }
    this.background = image
  }

  /* I have no idea how the alignment works exactly. I found that these numbers
  work well for a 7 by 13 matrix. */
  private async printTime(hour: number, minute: number) {
    const image = await new Jimp({ data: this.background, width: this.width, height: this.height })
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
