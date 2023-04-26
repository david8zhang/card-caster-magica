import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class WetStatus extends Status {
  public wetSprite: Phaser.GameObjects.Sprite
  public wetTween: Phaser.Tweens.Tween | null = null

  constructor(monster: Monster) {
    super({
      monster,
      statusType: StatusTypes.WET,
      duration: 4000,
      iconColor: 0x1434a4,
    })
    this.wetSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'wet')
      .setVisible(false)
  }

  public reactToIncomingStatus(incomingStatusType: StatusTypes): void {
    // Ignition will be negated if the monster is wet
    if (incomingStatusType == StatusTypes.IGNITED) {
      this.monster.clearStatus()
      return
    }
    // wet -> chill or chill -> wet = frozen status
    if (incomingStatusType === StatusTypes.CHILLED) {
      this.monster.setCurrStatus(StatusTypes.FROZEN)
      return
    }
    this.monster.setCurrStatus(incomingStatusType)
  }

  public clear() {
    this.wetSprite.setVisible(false)
    this.monster.sprite.clearTint()
    if (this.wetTween) {
      this.wetTween.stop()
      Game.instance.tweens.remove(this.wetTween)
    }
    super.clear()
  }

  public start(): void {
    this.monster.sprite.setTint(0x87ceeb)
    this.wetSprite.setVisible(true)
    this.wetSprite.setPosition(this.monster.sprite.x, this.monster.sprite.y)
    this.wetTween = Game.instance.tweens.add({
      targets: [this.wetSprite],
      duration: 1000,
      y: {
        from: this.wetSprite.y,
        to: this.wetSprite.y + 50,
      },
      alpha: {
        from: 1,
        to: 0,
      },
      repeat: -1,
    })
    super.start()
  }
}
