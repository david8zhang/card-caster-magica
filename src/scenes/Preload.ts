import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('cyclops', 'cyclops.png')
    this.load.image('wizard', 'wizard.png')
  }

  create() {
    this.scene.start('game')
  }
}
