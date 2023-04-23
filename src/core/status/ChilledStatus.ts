import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class ChilledStatus extends Status {
  constructor(monster: Monster) {
    super({
      statusType: StatusTypes.CHILLED,
      monster,
      duration: 1000,
      iconColor: 0x33feff,
    })
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    // If wet -> chilled or chilled -> wet, monster gets frozen
    if (incomingStatus.statusType === StatusTypes.WET) {
      this.monster.setCurrStatus(StatusTypes.FROZEN)
      return
    }

    // If monster is chilled, ignition will just be negated
    if (incomingStatus.statusType === StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatus)
  }
  public clear(): void {}
  public start(): void {
    this.monster.currStatusIndicatorCircle.setFillStyle(this.iconColor!).setVisible(true)
    super.start()
  }
}
