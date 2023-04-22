import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class FrozenStatus extends Status {
  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.FROZEN,
      duration: 1000,
    })
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    // Fire thaws frozen status
    if (incomingStatus.statusType === StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatus)
  }

  public clear(): void {}

  public start(): void {
    this.monster.currStatusIndicatorCircle.setFillStyle(0xffffff).setVisible(true)
    super.start()
  }
}
