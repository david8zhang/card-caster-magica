import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'
import { Constants } from '~/utils/Constants'

export class FrostWindCard extends SpellCard {
  public static DAMAGE = 10
  public frostWindSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      name: 'Frost Wind',
      windUpDurationSec: 1,
      executionDurationSec: 2,
      cardColor: 0x33feff,
      statusEffect: StatusTypes.CHILLED,
      imageSrc: 'frost-wind',
      descText: 'Blows frosty wind and deals 10 damage. Applies chilled effect',
    })
    this.frostWindSprite = this.game.add.sprite(0, 0, 'frost-wind-anim')
  }

  public execute() {
    if (this.wizardRef) {
      this.frostWindSprite.setPosition(Constants.MAP_WIDTH / 2, this.wizardRef.sprite.y)
      this.frostWindSprite.play('frost-wind-anim')
      this.game.tweens.add({
        targets: [this.frostWindSprite],
        duration: 2000,
        alpha: {
          from: 1,
          to: 0,
        },
        onComplete: () => {
          this.game.monster.takeDamage(FrostWindCard.DAMAGE)
          this.game.monster.applyStatusEffects(StatusTypes.CHILLED)
        },
      })
    }
  }
}
