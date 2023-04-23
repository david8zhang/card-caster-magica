import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'

export class FrostWindCard extends SpellCard {
  public static DAMAGE = 15

  constructor(game: Game) {
    super(game, {
      name: 'Frost Wind',
      windUpDurationSec: 1,
      executionDurationSec: 2,
      cardColor: 0x33feff,
      statusEffect: StatusTypes.CHILLED,
    })
  }

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging frost wind...',
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
        'Using frost wind!',
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
          this.game.monster.takeDamage(FrostWindCard.DAMAGE)
          this.game.monster.applyStatusEffects(StatusTypes.CHILLED)
        },
      })
    }
  }
}
