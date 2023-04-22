import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class NoneStatus extends Status {
  constructor(monster: Monster) {
    super({
      statusType: StatusTypes.NONE,
      duration: 0,
      monster,
    })
  }

  // No-op since there is no expiration event
  public clear() {
    return
  }

  // Override parent start method since None type status does not have expiration
  public start() {
    return
  }
}
