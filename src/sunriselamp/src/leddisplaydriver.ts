import Sk9822Driver = require('./sk9822driver')
import RectangularDisplay = require('./rectangulardisplay')

class LedDisplayDriver extends RectangularDisplay {
  private driver: Sk9822Driver
  private startLed: number
  private nPixels: number
  private brightnessAdjustment: number

  constructor(driver: Sk9822Driver, startLed: number, width: number, height: number, brightnessAdjustment: number = 1/20) {
    super(width, height)
    this.driver = driver
    this.startLed = startLed
    this.nPixels = width * height
    if(brightnessAdjustment > 1 || brightnessAdjustment <= 0) {
      throw new Error("Illegal brightness adjustment. Value must be in (0,1].")
    }
    this.brightnessAdjustment = brightnessAdjustment;
  }

write(image: Buffer) {
  this.validateInput(image)
  image = this.transform(image)
  image = this.adjustBrightnessInPlace(image)
  this.driver.setFromBitmap(image, this.startLed)
}

/**
  * Multiply the alhpa channel by the brightness brightnessAdjustment
  */
  private adjustBrightnessInPlace(image: Buffer): Buffer {
    for(let index = 0; index < this.nPixels; index++) {
      image[4*index + 3] = Math.ceil(image[4*index + 3] * this.brightnessAdjustment)
    }
    return image;
  }


/** Change pixel order from left-right, bottom-up to
  * bottom-up, left-right.
  */
  private transform(image: Buffer): Buffer {
    const transformedImage = new Buffer(image.length)
    for(let oldIndex = 0; oldIndex < this.nPixels; oldIndex++) {
      const newIndex = this.convertIndexRightUpToUpRight(oldIndex)
      transformedImage.writeUInt32LE(image.readUInt32LE(4*oldIndex), 4*newIndex)
    }
    return transformedImage;
  }

/** Convert pixel index from left-right, bottom-up order to
  * bottom-up, left-right order.
  */
  private convertIndexRightUpToUpRight(oldIndex: number): number {
      const XPosition = oldIndex % this.width
      const YPosition = Math.floor(oldIndex / this.width)
      return XPosition * this.height + (this.height - YPosition - 1)
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
