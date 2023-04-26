import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class FrozenStatus extends Status {
  public frozenSprite: Phaser.GameObjects.Sprite

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.FROZEN,
      duration: 3000,
      iconColor: 0xffffff,
    })
    this.frozenSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'frozen')
      .setVisible(false)
  }

  public reactToIncomingStatus(incomingStatusType: StatusTypes): void {
    // Fire thaws frozen status
    if (incomingStatusType === StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }
    super.reactToIncomingStatus(incomingStatusType)
  }

  shatter() {
    Game.instance.shakeAfterReaction()
    Game.instance.sound.play('shatter')
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
    Game.instance.sound.play('freeze')
    this.monster.sprite.setTint(this.iconColor!)
    this.frozenSprite.setVisible(true).setTexture('frozen')
    super.start()
  }
}
