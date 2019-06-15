abstract class SegmentDisplayDriver {
  displayDigits: [number, number, number, number] = [0,0,0,0]

  abstract setDisplay(hour:number, minute: number, separator: boolean): void
  abstract turnDisplayOff(): void

  private setDisplayTime(hours: number, minutes:number) {
    this.displayDigits[0] = Math.floor(hours / 10)
    this.displayDigits[1] = hours % 10
    this.displayDigits[2] = Math.floor(minutes / 10)
    this.displayDigits[3] = minutes % 10
  }
}

export = SegmentDisplayDriver
