import Game from '~/scenes/Game'
import { SpellCard } from './spells/SpellCard'
import { Constants, Sides } from '~/utils/Constants'
import { Wizard } from './Wizard'

export interface SpellTimelineConfig {
  position: {
    x: number
    y: number
  }
  wizard: Wizard
}

export class SpellTimeline {
  public static SPELL_TIMELINE_DURATION_SECONDS = 10
  private game: Game
  private spellSequence: SpellCard[] = []

  public static SPELL_TIMELINE_WIDTH = Constants.MAP_WIDTH - 110
  public static SPELL_TIMELINE_HEIGHT = 65

  private currSpellIndex: number = 0
  public rectangle: Phaser.GameObjects.Rectangle
  public wizard: Wizard

  public tickerLine: Phaser.GameObjects.Line

  constructor(game: Game, config: SpellTimelineConfig) {
    this.game = game
    this.wizard = config.wizard
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
        if (this.game.currTurn === Sides.PLAYER) {
          this.rectangle.setStrokeStyle(2, 0xffff00)
        }
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.rectangle.setStrokeStyle(0)
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.player.playCard(this)
      })
    this.tickerLine = this.game.add
      .line(
        0,
        0,
        this.rectangle.x,
        this.rectangle.y + this.rectangle.displayHeight,
        this.rectangle.x,
        this.rectangle.y,
        0xffffff
      )
      .setOrigin(0.5, 0)
      .setLineWidth(1)
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
    spellCard.wizardRef = this.wizard
    this.updateCardsInSpellSequence()
  }

  startTicker() {
    const startX = this.tickerLine.x
    this.tickerLine.setVisible(true)
    this.game.tweens.add({
      targets: [this.tickerLine],
      x: {
        from: startX,
        to: startX + this.rectangle.displayWidth,
      },
      duration: 10000,
      onComplete: () => {
        this.tickerLine.setPosition(startX, this.tickerLine.y)
        this.game.player.onTimelineFinished()
      },
    })
  }

  clear() {
    this.spellSequence.forEach((spellCard: SpellCard) => {
      spellCard.destroy()
    })
    this.spellSequence = []
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
    } else {
      this.currSpellIndex = 0
      return
    }
  }
}
