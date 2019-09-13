import Sk9822Driver = require('./sk9822driver')

class LedDisplayDriver {
  private driver: Sk9822Driver
  private startLed: number
  private width: number
  private height: number
  private nPixels: number

  constructor(driver: Sk9822Driver, startLed: number, width: number, height: number) {
    this.driver = driver
    this.startLed = startLed
    this.width = width
    this.height = height
    this.nPixels = width * height
  }

write(image: Buffer) {
  this.validateInput(image)
  image = this.transform(image)
  this.driver.setFromBitmap(image, this.startLed)
}

/** Change pixel order from left-right, bottom-up to
  * bottom-up, left-right.
  */
  private transform(image: Buffer): Buffer {
    const transformedImage = new Buffer(image.length)
    for(let oldIndex = 0; oldIndex < this.nPixels; oldIndex++) {
      const newIndex = this.convertIndexRightUpToUpRight(oldIndex)
      transformedImage.writeUInt32LE(image.readUInt32LE(oldIndex), newIndex)
    }
    return transformedImage;
  }

/** Convert pixel index from left-right, bottom-up order to
  * bottom-up, left-right order.
  */
  private convertIndexRightUpToUpRight(oldIndex: number): number {
      const XPosition = oldIndex % this.width
      const YPosition = Math.floor(oldIndex / this.width)
      return XPosition * this.height + YPosition
  }

/** Checks if an image has the right format. Should be performed
  * in every public function that take an image as input.
  */
  private validateInput(image: Buffer) {
    if(image.length != this.nPixels * 4) {
      throw new Error("Invalid image buffer. Incorrect size.")
    }
  }
}

export = LedDisplayDriver
