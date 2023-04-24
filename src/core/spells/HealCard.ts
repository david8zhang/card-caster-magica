import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class HealCard extends SpellCard {
  public static HEAL_AMOUNT = 10

  constructor(game: Game) {
    super(game, {
      name: 'Heal',
      windUpDurationSec: 2,
      executionDurationSec: 2,
      cardColor: 0xf8c8dc,
    })
  }

  public windUp(): void {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging heal...',
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
        'Healing party!',
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
          Game.instance.player.wizards.forEach((wizard) => {
            wizard.recoverHealth(HealCard.HEAL_AMOUNT)
          })
        },
      })
    }
  }
}
