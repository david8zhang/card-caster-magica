import Phaser from 'phaser'
import { Player } from '~/core/Player'
import { Constants } from '~/utils/Constants'

export default class Game extends Phaser.Scene {
  public player!: Player

  constructor() {
    super('game')
  }

  create() {
    const bgImage = this.add
      .rectangle(0, 0, Constants.MAP_WIDTH, Constants.MAP_HEIGHT, 0xc2b280)
      .setOrigin(0)
    this.player = new Player(this)
  }
}
