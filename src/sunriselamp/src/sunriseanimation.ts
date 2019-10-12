import RectangularDisplay = require('./rectangulardisplay')

class SunriseAnimation {
    private display: RectangularDisplay

    constructor(display: RectangularDisplay) {
        this.display = display
    }

    public setBrightness(brightness: number) {
        if(brightness < 0 || brightness > 1) {
            throw(new Error('Brightness must be between 0 and 1'))
        }

        const size = this.display.getWidth() * this.display.getHeight() * 4
        const image = Buffer.alloc(size, 255)
        for(let alphaIndex = 3; alphaIndex < size; alphaIndex += 4) {
            image[alphaIndex] = Math.round(brightness * 255)
        }
        
        this.display.write(image)
    }
}

export = SunriseAnimation