import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class IgnitedStatus extends Status {
  private damageOverTimeEvent!: Phaser.Time.TimerEvent
  public ignitedSprite: Phaser.GameObjects.Sprite
  public ignitedTween: Phaser.Tweens.Tween | null = null
  private static BURN_DMG_OVER_TIME = 5

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.IGNITED,
      duration: 2000,
      iconColor: 0xffa500,
    })
    this.ignitedSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'ignited')
      .setVisible(false)
  }

  public reactToIncomingStatus(incomingStatus: Status): void {}
  public clear(): void {
    this.monster.sprite.clearTint()
    this.damageOverTimeEvent.paused = true
    this.damageOverTimeEvent.destroy()
    this.ignitedSprite.setVisible(false)
    if (this.ignitedTween) {
      Game.instance.tweens.remove(this.ignitedTween)
    }
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
    this.monster.sprite.setTint(0xffa500)
    this.ignitedSprite.setVisible(true)
    this.ignitedTween = Game.instance.tweens.add({
      targets: [this.ignitedSprite],
      y: {
        from: this.ignitedSprite.y + 20,
        to: this.ignitedSprite.y - 20,
      },
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 250,
      repeat: -1,
    })
    super.start()
  }
}
