import Game from '~/scenes/Game'
import { UIValueBar } from '~/ui/UIValueBar'
import { Constants } from '~/utils/Constants'

export class Monster {
  private game: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  private healthBar: UIValueBar
  public static MAX_HEALTH = 1000

  constructor(game: Game) {
    this.game = game
    this.sprite = this.game.physics.add.sprite(
      Constants.MAP_WIDTH - 150,
      Constants.MAP_HEIGHT / 2,
      ''
    )
    this.healthBar = new UIValueBar(this.game, {
      x: this.sprite.x - 75,
      y: this.sprite.y + 25,
      width: 150,
      height: 5,
      maxValue: Monster.MAX_HEALTH,
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
      y: '-=20',
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
    })
  }

  startTurn() {
    this.attackPlayerWizards()
  }

  attackPlayerWizards() {
    const attackingText = this.game.add.text(this.sprite.x, this.sprite.y, 'Attacking!')
    attackingText.setPosition(attackingText.x - attackingText.displayWidth / 2, this.sprite.y)
    this.game.tweens.add({
      targets: [attackingText],
      y: '-=20',
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
      onComplete: () => {
        this.game.player.wizards.forEach((wizard) => {
          wizard.takeDamage(10)
        })
        this.game.switchTurn()
      },
    })
  }
}
