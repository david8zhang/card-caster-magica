import Game from '~/scenes/Game'
import { SpellTimeline } from './SpellTimeline'

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
  private sprite: Phaser.GameObjects.Sprite

  constructor(game: Game, config: WizardConfig) {
    this.game = game
    this.name = config.name
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
  }
}
