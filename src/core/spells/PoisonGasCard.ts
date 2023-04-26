import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'
import { Constants } from '~/utils/Constants'

export class PoisonGasCard extends SpellCard {
  public static DAMAGE = 10
  public poisonGasSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 3,
      executionDurationSec: 1,
      name: 'PoisonGas',
      cardColor: 0x0bda51,
      statusEffect: StatusTypes.POISONED,
      imageSrc: 'poison-gas',
      descText: 'Produces poison gas and deals 10 damage. Applies poison effect',
    })
    this.poisonGasSprite = this.game.add
      .sprite(0, 0, 'poison-gas-anim')
      .setDepth(Constants.SORT_LAYERS.UI)
      .setVisible(false)
  }

  public execute() {
    if (this.wizardRef) {
      this.game.sound.play('poison-cloud', {
        volume: 0.4,
      })
      this.game.tweens.add({
        targets: [this.game.monster.sprite],
        x: '+=5',
        yoyo: true,
        duration: 50,
        repeat: 5,
      })
      this.poisonGasSprite
        .setPosition(this.game.monster.sprite.x, this.game.monster.sprite.y)
        .setVisible(true)
      this.poisonGasSprite.play('poison-gas-anim', true)
      this.poisonGasSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (params) => {
        this.game.monster.takeDamage(PoisonGasCard.DAMAGE)
        this.game.monster.applyStatusEffects(StatusTypes.POISONED)
        this.game.tweens.add({
          targets: [this.poisonGasSprite],
          alpha: {
            from: 1,
            to: 0,
          },
          y: {
            from: this.game.monster.sprite.y,
            to: this.game.monster.sprite.y - 20,
          },
          duration: 250,
        })
      })
    }
  }
}
