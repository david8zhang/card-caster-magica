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

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging poison gas...',
        {
          fontSize: '12px',
          color: 'white',
        }
      )
      this.game.time.delayedCall(this.windUpDurationSec * 1000, () => {
        text.destroy()
      })
    }
  }

  public execute() {
    if (this.wizardRef) {
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
        console.log('Completed poison gas!')
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
