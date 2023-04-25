import Game from '~/scenes/Game'
import { SpellCard } from './SpellCard'
import { Status, StatusTypes } from '../status/Status'
import { Reactions } from '~/utils/Reactions'
import { FrozenStatus } from '../status/FrozenStatus'

export class RockThrowCard extends SpellCard {
  public static DAMAGE = 15
  public rockThrowSprite: Phaser.GameObjects.Sprite

  constructor(game: Game) {
    super(game, {
      name: 'Rock Throw',
      windUpDurationSec: 2,
      executionDurationSec: 1,
      cardColor: 0x964b00,
      imageSrc: 'rock-throw',
      descText: 'Throws a boulder and deals 25 damage',
    })
    this.rockThrowSprite = this.game.add.sprite(0, 0, 'rockball').setVisible(false)
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
      this.rockThrowSprite.setPosition(
        this.wizardRef.sprite.x,
        this.wizardRef.sprite.y - this.wizardRef.sprite.displayHeight / 2
      )
      const angleTowardMonster = Phaser.Math.Angle.Between(
        this.rockThrowSprite.x,
        this.rockThrowSprite.y,
        this.game.monster.sprite.x,
        this.game.monster.sprite.y
      )
      this.rockThrowSprite.setAngle(angleTowardMonster).setVisible(true)
      this.game.tweens.add({
        targets: [this.rockThrowSprite],
        x: {
          from: this.rockThrowSprite.x,
          to: this.game.monster.sprite.x,
        },
        y: {
          from: this.rockThrowSprite.y,
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
          if (this.game.monster.currStatusType === StatusTypes.FROZEN) {
            const frozenStatus = this.game.monster.currStatus as FrozenStatus
            frozenStatus.shatter()
            this.game.monster.takeDamage(Reactions.SHATTER_DAMAGE)
          }
          this.rockThrowSprite.play('rock-explosion-anim', true)
          this.rockThrowSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.rockThrowSprite.setVisible(false)
          })
          this.game.monster.takeDamage(RockThrowCard.DAMAGE)
        },
      })
    }
  }
}
