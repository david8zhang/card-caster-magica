import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class WetStatus extends Status {
  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.WET,
      duration: 3000,
    })
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    // Ignition will be negated if the monster is wet
    if (incomingStatus.statusType == StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }

    // wet -> chill or chill -> wet = frozen status
    if (incomingStatus.statusType === StatusTypes.CHILLED) {
      this.monster.setCurrStatus(StatusTypes.FROZEN)
      return
    }
    this.monster.setCurrStatus(incomingStatus.statusType)
  }

  public start(): void {
    this.monster.currStatusIndicatorCircle.setFillStyle(0x0000ff).setVisible(true)
    super.start()
  }
}
