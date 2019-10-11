import RectangularDisplay = require('./rectangulardisplay')
const chalk = require('chalk')
const readline = require('readline')

class ConsoleDisplay extends RectangularDisplay {
  constructor(width: number, height:number) {
    super(width, height)
  }

  write(image: Buffer): void {
    let imageText = ''
    for(let y = 0; y < this.getHeight(); y++) {
      for(let x = 0; x < this.getWidth(); x++) {
        let idx = (y * this.getWidth() + x) * 4
        imageText += chalk.rgb(image[idx], image[idx+1], image[idx+2])('\u2588')
      }
      imageText += '\n'
    }
    readline.cursorTo(process.stdout, 0, 0)
    process.stdout.write(imageText)
  }
}

export = ConsoleDisplay
