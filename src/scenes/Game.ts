import Phaser from 'phaser'
import { Monster } from '~/core/Monster'
import { Player } from '~/core/Player'
import { Constants, Sides } from '~/utils/Constants'

export default class Game extends Phaser.Scene {
  public player!: Player
  public monster!: Monster
  public currTurn: Sides = Sides.PLAYER

  constructor() {
    super('game')
  }

  create() {
    const bgImage = this.add
      .rectangle(0, 0, Constants.MAP_WIDTH, Constants.MAP_HEIGHT, 0xc2b280)
      .setOrigin(0)
    this.player = new Player(this)
    this.monster = new Monster(this)
  }

  switchTurn() {
    if (this.currTurn === Sides.PLAYER) {
      this.currTurn = Sides.CPU
      this.monster.startTurn()
    } else {
      this.currTurn = Sides.PLAYER
      this.player.startTurn()
    }
  }
}
