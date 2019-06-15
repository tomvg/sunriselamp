import SegmentDisplay = require('./segmentdisplay')
import SegmentDisplayDriver = require('./segmentdisplaydriver')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')

class MockDriver extends SegmentDisplayDriver {
  
}

test('segment display class exists', () => {
  const display = new SegmentDisplay(new Clock, new AlarmSettings)
})
