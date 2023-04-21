import { Monster } from '../Monster'
import { NoneStatus } from './NoneStatus'
import { Status, StatusTypes } from './Status'

export class WetStatus extends Status {
  constructor(monster: Monster) {
    super(monster)
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    if (incomingStatus.constructor.name === 'IgniteStatus') {
      this.monster.currStatusType = StatusTypes.NONE
      return
    }
  }
}
