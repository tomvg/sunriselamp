import spi = require('spi-device')

class Sk9822Driver {
  nLeds: number
  startFrameLength: number
  endFrameLength: number
  buffer: Buffer
  device: spi.SpiDevice

  constructor(nLeds : number) {
    this.startFrameLength = 4
    this.nLeds = nLeds
    this.endFrameLength = Math.ceil((nLeds - 1)/ 16)
    const bufferSize = this.startFrameLength + this.nLeds*4 + this.endFrameLength

    this.buffer = Buffer.alloc(bufferSize)

    this.device = spi.openSync(0, 0)

    // initialise the device to off
    this.turnOff()
  }

  /* Take a pixel array buffer in bitmap format and write it to the led array */
  setFromBitmap(bitmap: Buffer, offset: number = 0) {
    /* Byte order for the leds is brightness - blue - green - red
       for bitmaps, the order is red - green - blue - alpha
       Alpha is converted to brightness. Because the sk9822 brightness byte
       has only 5 bits available, the 3 least significant bits of the bitmap
       alpha byte are ignored.
       */
       let bufIdx = this.startFrameLength
       for(let bmpIdx = 0; bmpIdx < bitmap.byteLength; bmpIdx += 4) {
         this.buffer[bufIdx + 3] = bitmap[bmpIdx]
         this.buffer[bufIdx + 2] = bitmap[bmpIdx + 1]
         this.buffer[bufIdx + 1] = bitmap[bmpIdx + 2]
         this.buffer[bufIdx] = 0b11100000 | (bitmap[bmpIdx + 3] >> 3)
         bufIdx += 4
       }
  }

  turnOff() {
    // Fill the rgb values with 0's
    this.buffer.fill(0, this.startFrameLength, this.buffer.byteLength - this.endFrameLength);

    this.device.transferSync([{
      byteLength: this.buffer.byteLength,
      sendBuffer: this.buffer,
    }])
  }

}
