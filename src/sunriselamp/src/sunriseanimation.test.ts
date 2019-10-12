import SunriseAnimation = require('./sunriseanimation')
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

function meanBrightness(image: Buffer): number {
    let totalBrightness = 0
    const numberOfPixels = image.length / 4
    for(let i = 0; i < image.length; i += 4) {
        const red = image[i + 0] / 255
        const green = image[i + 1] / 255
        const blue = image[i + 2] / 255
        const alpha = image[i + 3] / 255
        totalBrightness += (red + green + blue) / 3 * alpha
    }
    return totalBrightness / numberOfPixels
}

test('throws when set brightness is not between 0 and 1', () => {
    const width = 7
    const height = 13
    const display = new MockDisplay(width, height)
    const sunrise = new SunriseAnimation(display)
    expect(() => sunrise.setBrightness(-0.1)).toThrow()
    expect(() => sunrise.setBrightness(1.1)).toThrow()
    expect(() => sunrise.setBrightness(1)).not.toThrow()
    expect(() => sunrise.setBrightness(0)).not.toThrow()
    expect(() => sunrise.setBrightness(0.5)).not.toThrow()
})

test('display is completely dark on 0 brightness', () => {
    const width = 7
    const height = 13
    const display = new MockDisplay(width, height)
    const sunrise = new SunriseAnimation(display)
    sunrise.setBrightness(0)
    expect(meanBrightness(display.lastWrittenBuffer)).toBe(0)
})

test('Brightness must be within 0.05 deviation of the set brightness', () => {
    const deviation = 0.05
    const width = 7
    const height = 13
    const display = new MockDisplay(width, height)
    const sunrise = new SunriseAnimation(display)
    for(let brightness = 0; brightness < 1; brightness += 0.01) {
        sunrise.setBrightness(brightness)
        let actualBrightness = meanBrightness(display.lastWrittenBuffer)
        expect(actualBrightness).toBeLessThan(brightness + deviation)
        expect(actualBrightness).toBeGreaterThan(brightness - deviation)
    }
})