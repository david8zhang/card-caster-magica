import Game from '~/scenes/Game'
import { SpellCard } from './spells/SpellCard'
import { Constants } from '~/utils/Constants'

export interface SpellTimelineConfig {
  position: {
    x: number
    y: number
  }
}

export class SpellTimeline {
  public static SPELL_TIMELINE_DURATION_SECONDS = 10
  private game: Game
  private spellSequence: SpellCard[] = []

  public static SPELL_TIMELINE_WIDTH = Constants.MAP_WIDTH - 110
  public static SPELL_TIMELINE_HEIGHT = 65

  private currSpellIndex: number = 0
  public rectangle: Phaser.GameObjects.Rectangle

  constructor(game: Game, config: SpellTimelineConfig) {
    this.game = game
    this.rectangle = this.game.add
      .rectangle(
        config.position.x,
        config.position.y,
        SpellTimeline.SPELL_TIMELINE_WIDTH,
        SpellTimeline.SPELL_TIMELINE_HEIGHT,
        0x555555,
        0.5
      )
      .setOrigin(0)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.rectangle.setStrokeStyle(2, 0xffff00)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.rectangle.setStrokeStyle(0)
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.player.playCard(this)
      })

    this.setupTickMarks()
  }

  canPlayCard(spellCard: SpellCard): boolean {
    return (
      this.durationOfCardsInSeq + spellCard.totalDurationSec <=
      SpellTimeline.SPELL_TIMELINE_DURATION_SECONDS
    )
  }

  public get durationOfCardsInSeq() {
    return this.spellSequence.reduce((acc, curr) => {
      return acc + curr.totalDurationSec
    }, 0)
  }

  setupTickMarks() {
    let x = this.rectangle.x
    for (let i = 0; i < 9; i++) {
      x += this.rectangle.displayWidth / 10
      this.game.add
        .line(
          0,
          0,
          x,
          this.rectangle.y + this.rectangle.displayHeight,
          x,
          this.rectangle.y + this.rectangle.displayHeight - 10,
          0xffffff
        )
        .setOrigin(0)
    }
  }

  updateCardsInSpellSequence() {
    let startX = this.rectangle.x
    this.spellSequence.forEach((card) => {
      card.spellTimelineRect
        .setPosition(startX, this.rectangle.y)
        .setVisible(true)
        .setDepth(this.rectangle.depth + 1)
        .setOrigin(0)
      startX += card.spellTimelineRect.displayWidth
    })
  }

  public addSpellToSpellSequence(spellCard: SpellCard) {
    this.spellSequence.push(spellCard)
    this.updateCardsInSpellSequence()
  }

  processNextSpell() {
    const currSpell = this.spellSequence[this.currSpellIndex]
    if (currSpell) {
      currSpell.windUp()
      this.game.time.delayedCall(currSpell.windUpDurationSec * 1000, () => {
        currSpell.execute()
        this.game.time.delayedCall(currSpell.executionDurationSec * 1000, () => {
          currSpell.aftermath()
          this.game.time.delayedCall(currSpell.aftermathDurationSec * 1000, () => {
            this.currSpellIndex++
            this.processNextSpell()
          })
        })
      })
    }
  }
}
