import LedTimeDisplay = require('./ledtimedisplay')
import RectangularDisplay = require('./rectangulardisplay')

class MockDisplay extends RectangularDisplay {
  public lastWrittenBuffer: Buffer

  constructor(width: number, height:number ) {
    super(width, height)
    this.lastWrittenBuffer = Buffer.alloc(width * height * 4)
  }

  write(image: Buffer): void {
    this.lastWrittenBuffer = image
  }
}

test('writes an image to the background', () => {
  const width = 7
  const height = 13
  const display = new MockDisplay(width, height)
  const timeDisplay = new LedTimeDisplay(display)
  const background = Buffer.alloc(width*height*4, 1)
  timeDisplay.setBackground(background)
  timeDisplay.setNoDisplay()
  expect(display.lastWrittenBuffer).toEqual(background)
})

test('throws on incorrect background image', () => {
  const width = 7
  const height = 13
  const display = new MockDisplay(width, height)
  const timeDisplay = new LedTimeDisplay(display)
  const background = Buffer.alloc(1)
  expect(() => timeDisplay.setBackground(background)).toThrow()
})

test('writes something over the background when time is displayed', (done) => {
  const width = 7
  const height = 13
  const display = new MockDisplay(width, height)
  const timeDisplay = new LedTimeDisplay(display, () => {
    const background = Buffer.alloc(width*height*4)
    timeDisplay.setBackground(background)
    timeDisplay.setDisplay(0, 0, true).then( () => {
      expect(display.lastWrittenBuffer).not.toEqual(background)
      done()
    })
  })
})
