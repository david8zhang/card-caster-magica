import Game from '~/scenes/Game'
import { UIValueBar } from '~/ui/UIValueBar'
import { Constants } from '~/utils/Constants'
import { StatusTypes } from './status/Status'
import { StatusFactory } from './status/StatusFactory'

export class Monster {
  public static MAX_HEALTH = 1000

  private game: Game
  private healthBar: UIValueBar

  public sprite: Phaser.Physics.Arcade.Sprite
  public currStatusType: StatusTypes
  public statusFactory: StatusFactory

  public currStatusIndicatorCircle: Phaser.GameObjects.Arc

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
    this.currStatusType = StatusTypes.NONE
    this.statusFactory = new StatusFactory(this)
    this.currStatusIndicatorCircle = this.game.add
      .circle(this.sprite.x + 25, this.sprite.y - 25, 5)
      .setVisible(false)
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

  startTurn() {
    this.clearStatus()
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

  applyStatusEffects(incomingStatusType: StatusTypes) {
    const incomingStatus = this.statusFactory.statusMapping[incomingStatusType]
    this.currStatus.reactToIncomingStatus(incomingStatus)
  }

  setCurrStatus(statusType: StatusTypes) {
    this.currStatus.clear()
    this.currStatusType = statusType
    this.currStatus.start()
  }

  public get currStatus() {
    return this.statusFactory.statusMapping[this.currStatusType]
  }

  clearStatus() {
    this.currStatus.clear()
    this.currStatusType = StatusTypes.NONE
    this.currStatusIndicatorCircle.setVisible(false)
  }
}
