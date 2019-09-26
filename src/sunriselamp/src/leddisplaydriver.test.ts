jest.mock('spi-device')
import LedDisplayDriver = require('./leddisplaydriver')
import Sk9822Driver = require('./sk9822driver')

class MockSk9822Driver extends Sk9822Driver {
  setFromBitmap = jest.fn()
}

test('throws on incorrect brightness value outside of (0,1]', () =>
{
  const startLed = 0
  const width = 7
  const height = 13

  const sk9822driver = new MockSk9822Driver(width * height)


  expect(() => new LedDisplayDriver(sk9822driver, startLed, width, height, 0)).toThrow()
  expect(() => new LedDisplayDriver(sk9822driver, startLed, width, height, -0.5)).toThrow()
  expect(() => new LedDisplayDriver(sk9822driver, startLed, width, height, 1.5)).toThrow()
  new LedDisplayDriver(sk9822driver, startLed, width, height, 1) // should not throw
})

test('throws on incorrect bpm insertion', () =>
{
  const startLed = 0
  const width = 7
  const height = 13

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height)

  expect(() => display.write(new Buffer(1))).toThrow()
})

test('multiplies brightness by the adjustment', () =>
{
  const startLed = 0
  const width = 4
  const height = 2
  const brightnessAdjustment = 0.5

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height, brightnessAdjustment)

  const bmp = Buffer.alloc(4*8, 0xFF)
  display.write(bmp)

  const writtenData = sk9822driver.setFromBitmap.mock.calls[0][0]
  expect(writtenData[3]).toBe(Math.ceil(0xFF * brightnessAdjustment))
  expect(writtenData[writtenData.length - 1]).toBe(Math.ceil(0xFF * brightnessAdjustment))
})

test('writes to the right leds after transformation', () =>
{
  const startLed = 0
  const width = 7
  const height = 13
  const brightnessAdjustment = 1

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height, brightnessAdjustment)

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

  expect(writtenImage.readUInt32LE(0)).toBe(0x4) // ul
  expect(writtenImage.readUInt32LE(height*(width - 1)*4)).toBe(0x3) // ur
  expect(writtenImage.readUInt32LE(width*height*4 - 4)).toBe(0x2) // lr
  expect(writtenImage.readUInt32LE(height*4 - 4)).toBe(0x11223344) // ll
  expect(writtenOffset).toBe(0)
})
