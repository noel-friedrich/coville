class Clock {

    constructor() {
        this.timeStamp = 0
    }

    get seconds() {
        return this.timeStamp % 60
    }

    get minutes() {
        return Math.floor(this.timeStamp / 60) % 60
    }

    get hours() {
        return Math.floor(this.timeStamp / 3600) % 24
    }

    get days() {
        return Math.floor(this.timeStamp / 86400)
    }

    reset() {
        this.timeStamp = 0
    }

    advanceSeconds(seconds) {
        this.timeStamp += seconds
    }

    advanceMinutes(minutes) {
        this.timeStamp += minutes * 60
    }

    advanceHours(hours) {
        this.timeStamp += hours * 3600
    }

    toString() {
        return `Tag#${String(this.days).padStart(2, "0")} ${String(this.hours).padStart(2, "0")}:${String(this.minutes).padStart(2, "0")}`
    }

}