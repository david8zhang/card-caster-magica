import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class TutorialSpellCard extends SpellCard {
  public static DAMAGE = 10

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 2,
      executionDurationSec: 1,
      name: 'Fireball',
      cardColor: 0xffa500,
    })
  }

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging fireball...',
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
        'Shooting fireball!',
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
          this.game.monster.takeDamage(TutorialSpellCard.DAMAGE)
        },
      })
    }
  }
}