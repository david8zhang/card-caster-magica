import { Reactions } from '~/utils/Reactions'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'
import Game from '~/scenes/Game'

export class PoisonedStatus extends Status {
  private damageOverTimeEvent!: Phaser.Time.TimerEvent
  public static POISON_DMG_OVER_TIME = 2
  public poisonedSprite: Phaser.GameObjects.Sprite
  public poisonedTween: Phaser.Tweens.Tween | null = null
  public explosionSprite: Phaser.GameObjects.Sprite

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.POISONED,
      duration: 3000,
      iconColor: 0x0bda51,
    })
    this.poisonedSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'poison')
      .setVisible(false)
    this.explosionSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'explosion')
      .setVisible(false)
      .setScale(5)
  }

  public reactToIncomingStatus(incomingStatusType: StatusTypes): void {
    // Explosion if ignited while already poisoned (but not the other way around)
    if (incomingStatusType === StatusTypes.IGNITED) {
      Game.instance.sound.play('explosion')
      Game.instance.shakeAfterReaction()
      this.explosionSprite.setVisible(true).setAlpha(1)
      this.explosionSprite.play('explosion')
      this.explosionSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        Game.instance.tweens.add({
          targets: [this.explosionSprite],
          alpha: {
            from: 1,
            to: 0,
          },
          duration: 150,
        })
        this.monster.takeDamage(Reactions.EXPLOSION_DAMAGE)
        this.monster.clearStatus()
      })
      return
    }

    // Poison is negated by water
    if (incomingStatusType === StatusTypes.WET) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatusType)
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
    this.poisonedSprite.setPosition(this.monster.sprite.x, this.monster.sprite.y)
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
