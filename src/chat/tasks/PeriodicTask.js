import { Task } from './Task'

class PeriodicTask extends Task {
  constructor(interval) {
    super()
    this._interval = interval
  }

  get interval() {
    return this._interval
  }

  handle(server) {
    throw new Error('not implemented')
  }
}

export { PeriodicTask }
