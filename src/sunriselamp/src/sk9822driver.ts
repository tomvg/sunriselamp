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

  /* Take a pixel array buffer in bitmap format and write it to the led array
     The offset is measured in pixels/leds. When the bitmap is too large,
     then end is ignored.
  */
  setFromBitmap(bitmap: Buffer, offset: number = 0) {
    /* Byte order for the leds is brightness - blue - green - red
       for bitmaps, the order is red - green - blue - alpha
       Alpha is converted to brightness. Because the sk9822 brightness byte
       has only 5 bits available, the 3 least significant bits of the bitmap
       alpha byte are ignored.
    */
     const bytesToWrite = Math.min(this.nLeds*4 - offset*4, bitmap.byteLength)
     let bufIdx = this.startFrameLength + offset*4
     for(let bmpIdx = 0; bmpIdx < bytesToWrite; bmpIdx += 4) {
       this.buffer[bufIdx + 3] = bitmap[bmpIdx]
       this.buffer[bufIdx + 2] = bitmap[bmpIdx + 1]
       this.buffer[bufIdx + 1] = bitmap[bmpIdx + 2]
       this.buffer[bufIdx] = 0b11100000 | (bitmap[bmpIdx + 3] >> 3)
       bufIdx += 4
     }

    this.writeCurrentBuffer()
  }

  turnOff() {
    // Fill the rgb values with 0's
    this.buffer.fill(0, this.startFrameLength,
       this.buffer.byteLength - this.endFrameLength);

    // Set the mandatory 3x1-bits in the first byte
    for(let idx = this.startFrameLength;
      idx < this.buffer.byteLength - this.endFrameLength;
      idx += 4) {
      this.buffer[idx] = 0b11100000
    }

    this.writeCurrentBuffer()
  }

  writeCurrentBuffer() {
    this.device.transferSync([{
      byteLength: this.buffer.byteLength,
      sendBuffer: this.buffer,
    }])
  }
}

export = Sk9822Driver
