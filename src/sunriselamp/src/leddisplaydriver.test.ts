jest.mock('spi-device')
import LedDisplayDriver = require('./leddisplaydriver')
import Sk9822Driver = require('./sk9822driver')

class MockSk9822Driver extends Sk9822Driver {
  setFromBitmap = jest.fn()
}

test('writes to the right leds', () =>
{
  const startLed = 0
  const width = 7
  const height = 13

  const sk9822driver = new MockSk9822Driver(width * height)
  const display = new LedDisplayDriver(sk9822driver, startLed, width, height)
  
})
