import Phaser from 'phaser'
import { Monster } from '~/core/Monster'
import { Player } from '~/core/Player'
import { Constants, Sides } from '~/utils/Constants'

export default class Game extends Phaser.Scene {
  public player!: Player
  public monster!: Monster
  public currTurn: Sides = Sides.PLAYER
  public overlayRect!: Phaser.GameObjects.Rectangle
  public overlayText!: Phaser.GameObjects.Text
  private static _instance: Game

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return this._instance
  }

  create() {
    const bgImage = this.add
      .rectangle(0, 0, Constants.MAP_WIDTH, Constants.MAP_HEIGHT, 0xc2b280)
      .setOrigin(0)
    this.player = new Player(this)
    this.monster = new Monster(this)
    this.setupOverlayRect()
  }

  setupOverlayRect() {
    this.overlayRect = this.add
      .rectangle(0, 0, Constants.WINDOW_WIDTH, Constants.WINDOW_WIDTH, 0x000000)
      .setAlpha(0)
      .setOrigin(0)

    this.overlayText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, '', {
        fontSize: '35px',
        color: 'white',
      })
      .setAlpha(0)
  }

  switchTurn() {
    const nextTurnSide = this.currTurn === Sides.PLAYER ? Sides.CPU : Sides.PLAYER
    const nextTurnEntity = this.currTurn === Sides.PLAYER ? this.monster : this.player
    this.overlayText.setText(`${nextTurnSide} Turn`)
    this.overlayText.setPosition(
      Constants.WINDOW_WIDTH / 2 - this.overlayText.displayWidth / 2,
      Constants.WINDOW_HEIGHT / 2 - this.overlayText.displayHeight / 2
    )

    this.tweens.add({
      targets: [this.overlayRect, this.overlayText],
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
  }
}
