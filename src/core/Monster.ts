import Game from '~/scenes/Game'
import { UIValueBar } from '~/ui/UIValueBar'
import { Constants } from '~/utils/Constants'
import { Status, StatusTypes } from './status/Status'
import { Wizard } from './Wizard'
import { NoneStatus } from './status/NoneStatus'
import { StatusFactory } from './status/StatusFactory'

export interface MonsterConfig {
  texture: string
  scale: number
}

export class Monster {
  public static MAX_HEALTH = 400
  public static DAMAGE = 15

  private game: Game
  private healthBar: UIValueBar

  public sprite: Phaser.Physics.Arcade.Sprite
  public currStatusType: StatusTypes = StatusTypes.NONE
  public damageNumQueue: number[] = []

  public attackSprites: Phaser.GameObjects.Sprite[] = []

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
      y: this.sprite.y + (this.sprite.displayHeight / 2 + 25),
      width: healthBarWidth,
      height: 10,
      maxValue: Monster.MAX_HEALTH,
      borderWidth: 2,
      showBorder: true,
      borderColor: 0x000000,
    })
    this.currStatusType = StatusTypes.NONE

    this.setupAttackSprites()
  }

  setupAttackSprites() {
    for (let i = 0; i < 2; i++) {
      const newAttackSprite = this.game.add
        .sprite(0, 0, 'swipe')
        .setVisible(false)
        .setScale(2)
        .setDepth(Constants.SORT_LAYERS.UI)
      newAttackSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        const wizard = newAttackSprite.getData('wizardRef')
        if (wizard) {
          wizard.takeDamage(Monster.DAMAGE)
        }
        this.game.tweens.add({
          targets: [wizard.sprite],
          x: '+=5',
          yoyo: true,
          duration: 50,
          repeat: 3,
        })
        this.game.tweens.add({
          targets: [newAttackSprite],
          alpha: {
            from: 1,
            to: 0,
          },
          duration: 200,
        })
      })
      this.attackSprites.push(newAttackSprite)
    }
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
        this.game.player.wizards.forEach((wizard: Wizard, index: number) => {
          const sprite = this.attackSprites[index]
          if (!sprite.getData('wizardRef')) {
            sprite.setData('wizardRef', wizard)
          }
          sprite
            .setPosition(wizard.sprite.x + 75, wizard.sprite.y - 75)
            .setVisible(true)
            .setAlpha(1)
          sprite.play('swipe')
        })
        this.game.time.delayedCall(200, () => {
          this.game.switchTurn()
        })
      },
    })
  }

  applyStatusEffects(incomingStatusType: StatusTypes) {
    this.currStatus.reactToIncomingStatus(incomingStatusType)
  }

  setMaxHealth(health: number) {
    this.healthBar.setMaxValue(health)
    this.healthBar.setCurrValue(health)
  }

  get currStatus() {
    return StatusFactory.statusMappingClasses[this.currStatusType]
  }

  setCurrStatus(statusType: StatusTypes) {
    this.currStatus.clear()
    this.currStatusType = statusType
    this.currStatus.start()
  }

  clearStatus() {
    this.currStatus.clear()
    this.currStatusType = StatusTypes.NONE
  }
}
