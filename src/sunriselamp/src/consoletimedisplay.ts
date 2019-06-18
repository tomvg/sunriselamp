import SegmentDisplayDriver = require('./segmentdisplaydriver')

class ConsoleTimeDisplay extends SegmentDisplayDriver {
  setDisplay(hour: number, minute: number, showSeparator: boolean) {
    this.saveDisplayCharacters(hour, minute, showSeparator)
    const d = this.displayDigits
    const s = this.separator ? ':' : ' '
    process.stdout.write(' ' + d[0] + d[1] + s + d[2] + d[3] + '\r')
  }

  turnDisplayOff() {
    process.stdout.write('      \r')
  }
}

export = ConsoleTimeDisplay
