import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class IgnitedStatus extends Status {
  private damageOverTimeEvent!: Phaser.Time.TimerEvent
  private static BURN_DMG_OVER_TIME = 5

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.IGNITED,
      duration: 1000,
    })
  }

  public reactToIncomingStatus(incomingStatus: Status): void {}
  public clear(): void {
    this.damageOverTimeEvent.paused = true
    this.damageOverTimeEvent.destroy()
    super.clear()
  }
  public start(): void {
    this.damageOverTimeEvent = Game.instance.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: () => {
        this.monster.takeDamage(IgnitedStatus.BURN_DMG_OVER_TIME)
      },
    })
    this.monster.currStatusIndicatorCircle.setFillStyle(0xff0000).setVisible(true)
    super.start()
  }
}
