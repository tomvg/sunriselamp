import Sk9822Driver = require('./sk9822driver')

jest.mock('spi-device')

test('sends the correct bytes for turning off all leds', () => {
  const threeLeds = new Sk9822Driver(3)
  const expectedBuffer = Buffer.from([
    0x00,0x00,0x00,0x00, // start frame
    0xE0,0x00,0x00,0x00, // led data 1
    0xE0,0x00,0x00,0x00, // led data 2
    0xE0,0x00,0x00,0x00, // led data 3
    0x00]) // end frame
  threeLeds.turnOff()
  expect(threeLeds.buffer).toEqual(expectedBuffer)
})

test('is turned off after construction', () => {
  const threeLeds = new Sk9822Driver(3)
  const expectedBuffer = Buffer.from([
    0x00,0x00,0x00,0x00, // start frame
    0xE0,0x00,0x00,0x00, // led data 1
    0xE0,0x00,0x00,0x00, // led data 2
    0xE0,0x00,0x00,0x00, // led data 3
    0x00]) // end frame
  expect(threeLeds.buffer).toEqual(expectedBuffer)
})

test('rgb and alpha are written to the right bytes', () => {
  const fourLeds = new Sk9822Driver(4)
  const inputBuffer = Buffer.from([
    0xA1,0x00,0x00,0x00, // led data 1
    0x00,0xB2,0x00,0x00, // led data 2
    0x00,0x00,0xC3,0x00, // led data 2
    0x00,0x00,0x00,0b01001111, // led data 4
  ])
  const expectedBuffer = Buffer.from([
    0x00,0x00,0x00,0x00, // start frame
    0xE0,0x00,0x00,0xA1, // led data 1
    0xE0,0x00,0xB2,0x00, // led data 2
    0xE0,0xC3,0x00,0x00, // led data 3
    0b11101001,0x00,0x00,0x00, // led data 4
    0x00]) // end frame
  fourLeds.setFromBitmap(inputBuffer)
  expect(fourLeds.buffer).toEqual(expectedBuffer)
})
