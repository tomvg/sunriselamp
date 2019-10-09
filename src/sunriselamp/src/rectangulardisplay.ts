abstract class RectangularDisplay {
  protected width: number
  protected height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getWidth(): number {
    return this.width
  }

  getHeight(): number {
    return this.height
  }

  abstract write(image: Buffer): void
}

export = RectangularDisplay
