import Game from '~/scenes/Game'
import { SpellTimeline } from './SpellTimeline'
import { UIValueBar } from '~/ui/UIValueBar'
import { Constants } from '~/utils/Constants'

export interface WizardConfig {
  position: {
    x: number
    y: number
  }
  texture: string
  name: string
}

export class Wizard {
  public name: string
  private game: Game
  public sprite: Phaser.GameObjects.Sprite
  public healthBar: UIValueBar
  public static MAX_HEALTH = 100

  constructor(game: Game, config: WizardConfig) {
    this.game = game
    this.name = config.name
    this.sprite = this.game.add
      .sprite(config.position.x, config.position.y, config.texture)
      .setScale(3)

    const healthBarWidth = this.sprite.displayWidth * 2
    this.healthBar = new UIValueBar(game, {
      x: this.sprite.x - healthBarWidth / 2,
      y: this.sprite.y + (this.sprite.displayHeight / 2 + 15),
      width: healthBarWidth,
      height: 5,
      maxValue: Wizard.MAX_HEALTH,
      borderWidth: 2,
      showBorder: true,
      borderColor: 0x000000,
    })
  }

  recoverHealth(recoverAmt: number) {
    const newHealth = Math.min(this.healthBar.maxValue, this.healthBar.currValue + recoverAmt)
    this.healthBar.setCurrValue(newHealth)
    const damageText = this.game.add
      .text(this.sprite.x, this.sprite.y, `+${recoverAmt}`, {
        fontSize: '20px',
        color: 'white',
      })
      .setDepth(Constants.SORT_LAYERS.UI)
    damageText.setPosition(this.sprite.x - damageText.displayWidth / 2, this.sprite.y)
    this.game.tweens.add({
      targets: [damageText],
      y: '-=50',
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 1000,
    })
  }

  setVisible(isVisible: boolean) {
    this.sprite.setVisible(isVisible)
    this.healthBar.setVisible(isVisible)
  }

  takeDamage(damage: number) {
    const newHealth = Math.max(0, this.healthBar.currValue - damage)
    this.healthBar.setCurrValue(newHealth)
    const damageText = this.game.add
      .text(this.sprite.x, this.sprite.y, `-${damage}`, {
        fontSize: '20px',
        color: 'white',
      })
      .setDepth(Constants.SORT_LAYERS.UI)
    damageText.setPosition(this.sprite.x - damageText.displayWidth / 2, this.sprite.y)
    this.game.tweens.add({
      targets: [damageText],
      y: '-=50',
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 1000,
    })
  }
}
