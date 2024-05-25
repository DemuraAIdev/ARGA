class TimeManager {
  constructor() {
    this.time = 0; // Updated time format
    this.timeMultiplier = 0.1; // 10 seconds in game = 1 second in real life
    this.interval = null;
  }

  start(startTime = "2000-01-01T00:00:00") {
    this.time = new Date(startTime).getTime(); // Set the starting time
    const intervalDuration = 1000 / this.timeMultiplier; // Adjust interval duration based on timeMultiplier
    this.interval = setInterval(() => {
      // Increment time by one second
      this.time += 1000; // Add 1000 milliseconds (1 second)
    }, intervalDuration); // Set interval duration
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  update(newTime) {
    const wasRunning = this.interval !== null;

    if (wasRunning) {
      clearInterval(this.interval);
    }

    this.time = new Date(newTime).getTime();

    if (wasRunning) {
      this.start();
    }
  }

  getCurrentTime() {
    const localTime = new Date(
      this.time - new Date().getTimezoneOffset() * 60000
    ); // Adjust for local time zone offset
    return localTime.toISOString().slice(0, 19).replace("T", " ");
  }

  // func sleep one day wakeup default at 06:00
  sleep(time = new Date().toISOString().slice(0, 10) + "T06:00:00") {
    const sleepTime = new Date(time).getTime();
    this.time = sleepTime;
  }

  getCurrentTimeRaw() {
    return this.time;
  }
}

module.exports = TimeManager;
