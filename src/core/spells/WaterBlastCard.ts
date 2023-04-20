import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class WaterBlastCard extends SpellCard {
  public static DAMAGE = 5

  constructor(game: Game) {
    super(game, {
      name: 'Water Blast',
      windUpDurationSec: 1,
      executionDurationSec: 2,
      aftermathDurationSec: 0,
      cardColor: 0x0000ff,
    })
  }

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging water blast...',
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
        'Blasting water!',
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
          this.game.monster.takeDamage(WaterBlastCard.DAMAGE)
        },
      })
    }
  }
}
