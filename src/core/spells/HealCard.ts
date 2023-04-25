import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'

export class HealCard extends SpellCard {
  public static HEAL_AMOUNT = 10
  public healSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      name: 'Heal',
      windUpDurationSec: 2,
      executionDurationSec: 2,
      cardColor: 0xf8c8dc,
      imageSrc: 'heal',
      descText: 'Heals party for 10 HP',
    })
    this.healSprite = this.game.add.sprite(0, 0, 'heal-anim').setVisible(false)
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
      this.healSprite
        .setPosition(this.wizardRef.sprite.x + 25, this.wizardRef.sprite.y - 25)
        .setVisible(true)
      this.healSprite.play('heal-anim')
      this.game.time.delayedCall(2000, () => {
        Game.instance.player.wizards.forEach((wizard) => {
          wizard.recoverHealth(HealCard.HEAL_AMOUNT)
        })
        this.game.tweens.add({
          targets: [this.healSprite],
          duration: 100,
          alpha: {
            from: 1,
            to: 0,
          },
          onComplete: () => {
            this.healSprite.setVisible(false)
          },
        })
      })
    }
  }
}
