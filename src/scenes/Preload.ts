import { Scene } from 'phaser'

export class Preload extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.laodEntities()
    this.loadSpellCards()
    this.loadStatuses()
    this.loadSpellAnimations()
    this.load.image('background', 'background.png')
    this.load.image('splash-art', 'splash-art.png')
    this.loadSound()
  }

  loadSound() {
    this.load.audio('ignited', 'sound/ignited.mp3')
    this.load.audio('bgm', 'sound/splash-bgm.mp3')
    this.load.audio('battle', 'sound/battle-music.mp3')
    this.load.audio('heal', 'sound/heal.wav')
    this.load.audio('fireball', 'sound/fireball.mp3')
    this.load.audio('explosion', 'sound/explosion.wav')
    this.load.audio('frost-wind', 'sound/frost-wind.mp3')
    this.load.audio('monster-attack', 'sound/monster-attack.mp3')
    this.load.audio('poison-cloud', 'sound/poison-cloud.mp3')
    this.load.audio('rock-blast', 'sound/rock-blast.mp3')
    this.load.audio('shatter', 'sound/shatter.mp3')
    this.load.audio('water-blast', 'sound/water-blast.mp3')
    this.load.audio('whoosh', 'sound/whoosh.mp3')
    this.load.audio('freeze', 'sound/freeze.mp3')
  }

  loadSpellAnimations() {
    this.load.atlas(
      'poison-gas-anim',
      'spells/animations/poison.png',
      'spells/animations/poison.json'
    )
    this.load.atlas('heal-anim', 'spells/animations/heal.png', 'spells/animations/heal.json')
    this.load.atlas(
      'fireball-anim',
      'spells/animations/fireball.png',
      'spells/animations/fireball.json'
    )
    this.load.image('rockball', 'spells/animations/rockball.png')
    this.load.atlas(
      'rock-explosion-anim',
      'spells/animations/rock-explosion.png',
      'spells/animations/rock-explosion.json'
    )
    this.load.atlas(
      'frozen-shatter',
      'spells/animations/frozen-shatter.png',
      'spells/animations/frozen-shatter.json'
    )
    this.load.atlas(
      'water-blast-anim',
      'spells/animations/water-blast.png',
      'spells/animations/water-blast.json'
    )
    this.load.atlas(
      'frost-wind-anim',
      'spells/animations/frost-wind.png',
      'spells/animations/frost-wind.json'
    )
    this.load.atlas(
      'explosion',
      'spells/animations/big-explosion.png',
      'spells/animations/big-explosion.json'
    )
    this.load.atlas('swipe', 'spells/animations/swipe.png', 'spells/animations/swipe.json')
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
