import Game from '~/scenes/Game'
import { Monster } from '../Monster'
import { Status, StatusTypes } from './Status'

export class ChilledStatus extends Status {
  public chilledSprite: Phaser.GameObjects.Sprite
  public chilledTween: Phaser.Tweens.Tween | null = null

  constructor(monster: Monster) {
    super({
      statusType: StatusTypes.CHILLED,
      monster,
      duration: 1000,
      iconColor: 0x33feff,
    })
    this.chilledSprite = Game.instance.add
      .sprite(this.monster.sprite.x, this.monster.sprite.y, 'chilled')
      .setVisible(false)
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
  public clear(): void {
    this.monster.sprite.clearTint()
    this.chilledSprite.setVisible(false)
    if (this.chilledTween) {
      this.chilledTween.stop()
      Game.instance.tweens.remove(this.chilledTween)
    }
    super.clear()
  }

  public start(): void {
    this.chilledSprite.setVisible(true)
    this.monster.sprite.setTint(this.iconColor!)
    this.chilledTween = Game.instance.tweens.add({
      targets: [this.chilledSprite, this.monster.sprite],
      x: '+=5',
      duration: 50,
      yoyo: true,
      repeat: -1,
    })
    super.start()
  }
}
