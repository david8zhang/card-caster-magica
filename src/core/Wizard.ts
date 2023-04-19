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
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
    this.healthBar = new UIValueBar(game, {
      x: this.sprite.x - 50,
      y: this.sprite.y + 25,
      width: 100,
      height: 5,
      maxValue: Wizard.MAX_HEALTH,
      borderWidth: 0,
    })
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
