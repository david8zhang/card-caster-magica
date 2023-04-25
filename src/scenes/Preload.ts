import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.laodEntities()
    this.loadSpellCards()
    this.loadStatuses()
    this.load.image('background', 'background.png')
  }

  laodEntities() {
    this.load.image('cyclops', 'monsters/cyclops.png')
    this.load.image('bat', 'monsters/bat.png')
    this.load.image('spider', 'monsters/spider.png')
    this.load.image('wizard', 'wizard.png')
  }

  loadSpellCards() {
    this.load.image('fireball', 'spells/fireball.png')
    this.load.image('frost-wind', 'spells/frost-wind.png')
    this.load.image('heal', 'spells/heal.png')
    this.load.image('water-blast', 'spells/water-blast.png')
    this.load.image('poison-gas', 'spells/poison-gas.png')
    this.load.image('rock-throw', 'spells/rock-throw.png')
  }

  loadStatuses() {
    this.load.image('chilled', 'status/chilled.png')
    this.load.image('frozen', 'status/frozen.png')
    this.load.image('ignited', 'status/ignited.png')
    this.load.image('poison', 'status/poison.png')
    this.load.image('wet', 'status/wet.png')
  }

  create() {
    this.scene.start('main-menu')
  }
}
