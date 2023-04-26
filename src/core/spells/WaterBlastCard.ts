import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'
import { Constants } from '~/utils/Constants'

export class WaterBlastCard extends SpellCard {
  public static DAMAGE = 5
  public waterBlastSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      name: 'Water Blast',
      windUpDurationSec: 1,
      executionDurationSec: 2,
      cardColor: 0x1434a4,
      statusEffect: StatusTypes.WET,
      imageSrc: 'water-blast',
      descText: 'Blasts foe with water and deals 5 damage. Applies wet effect',
    })
    this.spellTimelineStatusEffectRect?.setStrokeStyle(2, 0x0000ff, 1).setAlpha(0.5)
    this.waterBlastSprite = this.game.add.sprite(0, 0, 'water-blast-anim').setVisible(false)
  }

  public execute() {
    if (this.wizardRef) {
      this.waterBlastSprite
        .setPosition(Constants.MAP_WIDTH / 2, this.wizardRef.sprite.y - 50)
        .setVisible(true)
      this.waterBlastSprite.play('water-blast-anim')
      this.waterBlastSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.game.monster.takeDamage(WaterBlastCard.DAMAGE)
        this.game.tweens.add({
          targets: [this.waterBlastSprite],
          alpha: {
            from: 1,
            to: 0,
          },
          duration: 250,
        })
        this.game.monster.applyStatusEffects(StatusTypes.WET)
      })
    }
  }
}
