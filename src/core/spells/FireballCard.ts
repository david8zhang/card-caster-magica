import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class FireballCard extends SpellCard {
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
}
