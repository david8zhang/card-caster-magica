import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { Status, StatusTypes } from '../status/Status'
import { Reactions } from '~/utils/Reactions'

export class RockThrowCard extends SpellCard {
  public static DAMAGE = 25

  constructor(game: Game) {
    super(game, {
      name: 'Rock Throw',
      windUpDurationSec: 2,
      executionDurationSec: 1,
      aftermathDurationSec: 1,
      cardColor: 0x964b00,
    })
  }

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - 20,
        'Charging rock throw...',
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
        'Throwing rock!',
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
          this.game.monster.takeDamage(RockThrowCard.DAMAGE)
          if (this.game.monster.currStatusType === StatusTypes.FROZEN) {
            this.game.monster.takeDamage(Reactions.SHATTER_DAMAGE)
          }
        },
      })
    }
  }
}
