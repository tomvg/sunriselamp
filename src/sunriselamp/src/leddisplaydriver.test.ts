import DisplayDriver = require('./leddisplaydriver')

jest.mock('spi-device')

test('binds to the right leds', () =>
{
  const startLed = 0;
  const width = 7;
  const height = 13;
  const transformation = {
    mirror: true,
    rotation: 'cw',
  }
  const driver = new DisplayDriver(startLed, width, height, transformation)
})
