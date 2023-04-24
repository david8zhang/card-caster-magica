import Phaser from 'phaser'

import Game from './scenes/Game'
import { Constants } from './utils/Constants'
import { Preload } from './scenes/Preload'
import { MainMenu } from './scenes/MainMenu'
import { GameOver } from './scenes/GameOver'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: Constants.WINDOW_WIDTH,
  height: Constants.WINDOW_HEIGHT,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, MainMenu, Game, GameOver],
}

export default new Phaser.Game(config)
