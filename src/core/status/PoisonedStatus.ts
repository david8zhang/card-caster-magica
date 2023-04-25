import { Reactions } from '~/utils/Reactions'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'
import Game from '~/scenes/Game'

export class PoisonedStatus extends Status {
  private damageOverTimeEvent!: Phaser.Time.TimerEvent
  public static POISON_DMG_OVER_TIME = 1
  public poisonedSprite: Phaser.GameObjects.Sprite
  public poisonedTween: Phaser.Tweens.Tween | null = null

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.POISONED,
      duration: 2000,
      iconColor: 0x0bda51,
    })
    this.poisonedSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'poison')
      .setVisible(false)
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
    this.monster.sprite.clearTint()
    this.poisonedSprite.setVisible(false)

    if (this.poisonedTween) {
      this.poisonedTween.stop()
      Game.instance.tweens.remove(this.poisonedTween)
    }

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
    this.poisonedSprite.setVisible(true)
    this.poisonedTween = Game.instance.tweens.add({
      targets: [this.poisonedSprite],
      y: {
        from: this.poisonedSprite.y,
        to: this.poisonedSprite.y - 50,
      },
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
      repeat: -1,
    })
    this.monster.sprite.setTint(0x0bda51)
    super.start()
  }
}
