import Phaser from 'phaser'
import { Monster } from '~/core/Monster'
import { Player } from '~/core/Player'
import { Tutorial } from '~/core/Tutorial'
import { SpellCard } from '~/core/spells/SpellCard'
import { StatusFactory } from '~/core/status/StatusFactory'
import { Constants, Sides } from '~/utils/Constants'

export default class Game extends Phaser.Scene {
  public player!: Player
  public monster!: Monster
  public currTurn: Sides = Sides.PLAYER
  public overlayRect!: Phaser.GameObjects.Rectangle
  public overlayText!: Phaser.GameObjects.Text
  public statusFactory!: StatusFactory
  private static _instance: Game
  private showTutorial: boolean = false
  private tutorial!: Tutorial

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return this._instance
  }

  shakeAfterReaction() {
    this.cameras.main.shake(150, 0.005)
  }

  init(data: { showTutorial: boolean }) {
    if (data) {
      this.showTutorial = data.showTutorial
    }
  }

  create() {
    const bgImage = this.add.image(Constants.MAP_WIDTH / 2, Constants.MAP_HEIGHT / 2, 'background')
    this.monster = new Monster(this, {
      scale: 12,
      texture: 'cyclops',
    })
    this.statusFactory = new StatusFactory(this.monster)
    this.player = new Player(this)
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      const spellCard = gameObject.getData('ref') as SpellCard
      if (spellCard) {
        spellCard.handleDrag(dragX, dragY)
      }
    })
    this.input.on('dragend', (pointer, gameObject) => {
      const spellCard = gameObject.getData('ref') as SpellCard
      if (spellCard) {
        spellCard.handleDragEnd()
      }
    })
    this.setupOverlayRect()

    this.tutorial = new Tutorial(this)
    if (this.showTutorial) {
      this.tutorial.start()
    } else {
      this.player.drawCards()
    }
  }

  setupOverlayRect() {
    this.overlayRect = this.add
      .rectangle(0, 0, Constants.WINDOW_WIDTH, Constants.WINDOW_WIDTH, 0x000000)
      .setAlpha(0)
      .setOrigin(0)
      .setDepth(Constants.SORT_LAYERS.UI)

    this.overlayText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, '', {
        fontSize: '35px',
        color: 'white',
      })
      .setAlpha(0)
      .setDepth(Constants.SORT_LAYERS.UI)
  }

  getWinningSide() {
    if (this.monster.currHealth === 0) {
      return Sides.PLAYER
    } else {
      for (let i = 0; i < this.player.wizards.length; i++) {
        const wizard = this.player.wizards[i]
        if (wizard.healthBar.currValue > 0) {
          return null
        }
      }
      return Sides.CPU
    }
  }

  switchTurn() {
    const winningSide: Sides | null = this.getWinningSide()
    if (winningSide) {
      this.tweens.add({
        targets: [this.overlayRect],
        alpha: {
          from: 0,
          to: 1,
        },
        duration: 1000,
        hold: 1000,
        onComplete: () => {
          this.scene.start('gameover', {
            winningSide,
          })
        },
      })
    } else {
      const nextTurnSide = this.currTurn === Sides.PLAYER ? Sides.CPU : Sides.PLAYER
      const nextTurnEntity = this.currTurn === Sides.PLAYER ? this.monster : this.player
      this.overlayText.setText(`${nextTurnSide} Turn`)
      this.overlayText.setPosition(
        Constants.WINDOW_WIDTH / 2 - this.overlayText.displayWidth / 2,
        Constants.WINDOW_HEIGHT / 2 - this.overlayText.displayHeight / 2
      )

      this.tweens.add({
        targets: [this.overlayRect],
        alpha: {
          from: 0,
          to: 0.5,
        },
        duration: 1000,
        hold: 1000,
        yoyo: true,
        onComplete: () => {
          this.currTurn = nextTurnSide
          nextTurnEntity.startTurn()
        },
      })

      this.tweens.add({
        targets: [this.overlayText],
        alpha: {
          from: 0,
          to: 1,
        },
        duration: 1000,
        hold: 1000,
        yoyo: true,
      })
    }
  }
}
