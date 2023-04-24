import Game from '~/scenes/Game'
import { UIValueBar } from '~/ui/UIValueBar'
import { Constants } from '~/utils/Constants'
import { StatusTypes } from './status/Status'

export interface MonsterConfig {
  texture: string
  scale: number
}

export class Monster {
  public static MAX_HEALTH = 1000
  public static DAMAGE = 15

  private game: Game
  private healthBar: UIValueBar

  public sprite: Phaser.Physics.Arcade.Sprite
  public currStatusType: StatusTypes
  public currStatusIndicatorCircle: Phaser.GameObjects.Arc
  public damageNumQueue: number[] = []

  constructor(game: Game, config: MonsterConfig) {
    this.game = game
    this.sprite = this.game.physics.add
      .sprite(Constants.MAP_WIDTH - 150, Constants.MAP_HEIGHT / 2, config.texture)
      .setScale(config.scale)
      .setFlipX(true)

    this.sprite.setPosition(
      Constants.MAP_WIDTH - this.sprite.displayWidth,
      Constants.MAP_HEIGHT / 2
    )

    const healthBarWidth = this.sprite.displayWidth + 25

    this.healthBar = new UIValueBar(this.game, {
      x: this.sprite.x - healthBarWidth / 2,
      y: this.sprite.y - (this.sprite.displayHeight / 2 + 25),
      width: healthBarWidth,
      height: 10,
      maxValue: Monster.MAX_HEALTH,
      borderWidth: 2,
      showBorder: true,
    })
    this.currStatusType = StatusTypes.NONE
    this.currStatusIndicatorCircle = this.game.add
      .circle(this.sprite.x + 25, this.sprite.y - 25, 5)
      .setVisible(false)
  }

  get currHealth() {
    return this.healthBar.currValue
  }

  takeDamage(damage: number) {
    const y = this.healthBar.y - this.damageNumQueue.length * 25
    this.damageNumQueue.push(damage)
    const newHealth = Math.max(0, this.healthBar.currValue - damage)
    this.healthBar.setCurrValue(newHealth)
    const damageText = this.game.add
      .text(this.sprite.x, this.sprite.y, `-${damage}`, {
        fontSize: '20px',
        color: 'white',
      })
      .setDepth(Constants.SORT_LAYERS.UI)
    damageText.setPosition(this.sprite.x - damageText.displayWidth / 2, y)
    this.game.tweens.add({
      targets: [damageText],
      y: '-=10',
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 1000,
      onStart: () => {
        this.game.time.delayedCall(500, () => {
          this.damageNumQueue.shift()
        })
      },
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
          wizard.takeDamage(Monster.DAMAGE)
        })
        this.game.switchTurn()
      },
    })
  }

  applyStatusEffects(incomingStatusType: StatusTypes) {
    const incomingStatus = this.game.statusFactory.statusMapping[incomingStatusType]
    this.currStatus.reactToIncomingStatus(incomingStatus)
  }

  setMaxHealth(health: number) {
    this.healthBar.setMaxValue(health)
    this.healthBar.setCurrValue(health)
  }

  setCurrStatus(statusType: StatusTypes) {
    this.currStatus.clear()
    this.currStatusType = statusType
    this.currStatus.start()
  }

  public get currStatus() {
    return this.game.statusFactory.statusMapping[this.currStatusType]
  }

  clearStatus() {
    this.currStatus.clear()
    this.currStatusType = StatusTypes.NONE
    this.currStatusIndicatorCircle.setVisible(false)
  }
}
