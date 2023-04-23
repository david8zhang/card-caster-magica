import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'

export class PoisonGasCard extends SpellCard {
  public static DAMAGE = 10

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 3,
      executionDurationSec: 1,
      name: 'PoisonGas',
      cardColor: 0x0bda51,
      statusEffect: StatusTypes.POISONED,
    })
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
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y,
        'Spreading poison gas!',
        {
          fontSize: '12px',
          color: 'white',
        }
      )
      this.game.tweens.add({
        targets: [text],
        duration: this.executionDurationSec * 1000,
        y: {
          from: this.wizardRef.sprite.y,
          to: this.wizardRef.sprite.y - 25,
        },
        alpha: {
          from: 1,
          to: 0,
        },
        onComplete: () => {
          text.destroy()
          this.game.monster.takeDamage(PoisonGasCard.DAMAGE)
          this.game.monster.applyStatusEffects(StatusTypes.POISONED)
        },
      })
    }
  }
}
