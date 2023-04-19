import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class FireballCard extends SpellCard {
  public static DAMAGE = 10

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 2,
      executionDurationSec: 1,
      aftermathDurationSec: 0,
      name: 'Fireball',
    })
  }

  public setupCardRect(): void {
    this.spellCardRect = this.game.add
      .rectangle(0, 0, SpellCard.SPELL_CARD_WIDTH, SpellCard.SPELL_CARD_HEIGHT, 0xff0000)
      .setVisible(false)
      .setInteractive()
      .on('pointerdown', () => {
        this.game.player.selectCardToPlay(this)
      })
  }

  public windUp() {
    if (this.wizardRef) {
      // TODO: Replace this with an actual fireball charging animation
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y,
        'Winding up!',
        {
          fontSize: '12px',
          color: 'white',
        }
      )
      this.game.tweens.add({
        targets: [text],
        duration: this.windUpDurationSec * 1000,
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
        },
      })
    }
  }

  public execute() {
    if (this.wizardRef) {
      const text = this.game.add.text(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y,
        'Executing',
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
          this.game.monster.takeDamage(FireballCard.DAMAGE)
        },
      })
    }
  }
}
