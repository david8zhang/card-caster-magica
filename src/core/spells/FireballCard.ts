import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { StatusTypes } from '../status/Status'

export class FireballCard extends SpellCard {
  public static DAMAGE = 10
  public fireballSprite: Phaser.GameObjects.Sprite
  public chargingSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 2,
      executionDurationSec: 1,
      name: 'Fireball',
      cardColor: 0xffa500,
      statusEffect: StatusTypes.IGNITED,
      imageSrc: 'fireball',
      descText: 'Shoots a fireball and deals 10 damage. Applies ignite effect',
    })
    this.fireballSprite = this.game.add.sprite(0, 0, 'fireball-anim').setVisible(false)
    this.chargingSprite = this.game.add.sprite(0, 0, '').setVisible(false)
  }

  public execute() {
    if (this.wizardRef) {
      this.game.sound.play('fireball', {
        volume: 0.4,
      })
      this.fireballSprite
        .setPosition(
          this.wizardRef.sprite.x,
          this.wizardRef.sprite.y - this.wizardRef.sprite.displayHeight / 2
        )
        .setVisible(true)
      this.fireballSprite.anims.play('fireball-anim')

      const angleTowardMonster = Phaser.Math.Angle.Between(
        this.fireballSprite.x,
        this.fireballSprite.y,
        this.game.monster.sprite.x,
        this.game.monster.sprite.y
      )
      this.fireballSprite.setAngle(angleTowardMonster)
      this.game.tweens.add({
        targets: [this.fireballSprite],
        x: {
          from: this.fireballSprite.x,
          to: this.game.monster.sprite.x,
        },
        y: {
          from: this.fireballSprite.y,
          to: this.game.monster.sprite.y,
        },
        duration: 1000,
        onComplete: () => {
          this.game.tweens.add({
            targets: [this.game.monster.sprite],
            x: '+=5',
            yoyo: true,
            duration: 50,
            repeat: 3,
          })
          this.fireballSprite.setVisible(false)
          this.game.monster.takeDamage(FireballCard.DAMAGE)
          this.game.monster.applyStatusEffects(StatusTypes.IGNITED)
        },
      })
    }
  }
}
