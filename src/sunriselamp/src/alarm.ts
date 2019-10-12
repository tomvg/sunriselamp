import View = require('./view')
import Clock = require('./clock')
import AlarmSettings = require('./alarmsettings')

class Alarm extends View {
    clock: Clock
    alarmSettings: AlarmSettings

    constructor(clock: Clock, alarmSettings: AlarmSettings) {
        super()
        this.clock = clock
        this.alarmSettings = alarmSettings

        clock.subscribe(this)
        alarmSettings.subscribe(this)
    }

    notify(): void {

    }
}