import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class FrozenStatus extends Status {
  public frozenSprite: Phaser.GameObjects.Sprite

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.FROZEN,
      duration: 2000,
      iconColor: 0xffffff,
    })
    this.frozenSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'frozen')
      .setVisible(false)
  }

  public reactToIncomingStatus(incomingStatus: Status): void {
    // Fire thaws frozen status
    if (incomingStatus.statusType === StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatus)
  }

  shatter() {
    Game.instance.shakeAfterReaction()
    this.frozenSprite.play('frozen-shatter', true)
    this.frozenSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.clear()
    })
  }

  public clear(): void {
    Game.instance.tweens.add({
      targets: [this.frozenSprite],
      alpha: {
        from: 1,
        to: 0,
      },
      onComplete: () => {
        this.frozenSprite.setAlpha(1).setVisible(false)
        this.monster.sprite.clearTint()
        super.clear()
      },
      duration: 200,
    })
  }

  public start(): void {
    this.monster.sprite.setTint(this.iconColor!)
    this.frozenSprite.setVisible(true)
    super.start()
  }
}
