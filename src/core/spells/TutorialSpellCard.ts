import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { FireballCard } from './FireballCard'

export class TutorialSpellCard extends SpellCard {
  public static DAMAGE = 10
  public fireballSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      windUpDurationSec: 2,
      executionDurationSec: 1,
      name: 'Fireball',
      cardColor: 0xffa500,
      imageSrc: 'fireball',
      descText: 'Shoots a fireball and deals 10 damage. Applies ignite effect',
    })
    this.fireballSprite = this.game.add.sprite(0, 0, 'fireball-anim').setVisible(false)
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
        },
      })
    }
  }
}
