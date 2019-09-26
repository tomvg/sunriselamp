abstract class TimeDisplay {
  displayDigits: [number, number, number, number] = [0,0,0,0]
  separator: boolean = true

  abstract setDisplay(hour:number, minute: number, separator: boolean): void
  abstract turnDisplayOff(): void

  protected saveDisplayCharacters(hours: number, minutes:number, separator: boolean) {
    this.displayDigits[0] = Math.floor(hours / 10)
    this.displayDigits[1] = hours % 10
    this.displayDigits[2] = Math.floor(minutes / 10)
    this.displayDigits[3] = minutes % 10
    this.separator = separator
  }
}

export = TimeDisplay
