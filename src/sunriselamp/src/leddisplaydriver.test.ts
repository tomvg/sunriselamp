jest.mock('spi-device')
import LedDisplayDriver = require('./leddisplaydriver')
import Sk9822Driver = require('./sk9822driver')

class MockSk9822Driver extends Sk9822Driver {
  setFromBitmap = jest.fn()
}


test('throws on incorrect bpm insertion', () =>
{
  const startLed = 0
  const width = 7
  const height = 13

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height)

  expect(() => display.write(new Buffer(1))).toThrow()
})

test('writes to the right leds after transformation', () =>
{
  const startLed = 0
  const width = 7
  const height = 13

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height)

  const bmp = new Buffer(width*height*4)
  
  // Check all the corners of the image
  bmp.writeUInt32LE(0x11223344, 0) // left lower corner
  bmp.writeUInt32LE(0x2, width*4 - 4) // lower right corner
  bmp.writeUInt32LE(0x3, width*height*4 - 4) // upper right corner
  bmp.writeUInt32LE(0x4, (height - 1)*width*4) // upper left corner
  display.write(bmp)
  const writtenData = sk9822driver.setFromBitmap.mock.calls[0]
  const writtenImage = writtenData[0]
  const writtenOffset = writtenData[1]

  expect(writtenImage.readUInt32LE(0)).toBe(0x11223344) // ll
  expect(writtenImage.readUInt32LE(height*(width - 1)*4)).toBe(0x2) // lr
  expect(writtenImage.readUInt32LE(width*height*4 - 4)).toBe(0x3) // ur
  expect(writtenImage.readUInt32LE(height*4 - 4)).toBe(0x4) // ul
  expect(writtenOffset).toBe(0)
})
