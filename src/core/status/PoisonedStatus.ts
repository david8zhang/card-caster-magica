import { Reactions } from '~/utils/Reactions'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'
import Game from '~/scenes/Game'

export class PoisonedStatus extends Status {
  private damageOverTimeEvent!: Phaser.Time.TimerEvent
  public static POISON_DMG_OVER_TIME = 1

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.POISONED,
      duration: 3000,
    })
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    // Explosion if ignited while already poisoned (but not the other way around)
    if (incomingStatus.statusType === StatusTypes.IGNITED) {
      Game.instance.cameras.main.shake(150, 0.005)
      this.monster.takeDamage(Reactions.EXPLOSION_DAMAGE)
      this.monster.clearStatus()
      return
    }

    // Poison is negated by water
    if (incomingStatus.statusType === StatusTypes.WET) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatus)
  }
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
        this.monster.takeDamage(PoisonedStatus.POISON_DMG_OVER_TIME)
      },
    })
    this.monster.currStatusIndicatorCircle.setFillStyle(0x0bda51).setVisible(true)
    super.start()
  }
}
