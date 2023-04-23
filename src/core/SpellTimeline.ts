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
  private spellSequenceMapping: {
    [key: string]: SpellCard
  } = {}

  public static SPELL_TIMELINE_WIDTH = Constants.MAP_WIDTH - 110
  public static SPELL_TIMELINE_HEIGHT = 65

  private currSpellIndex: number = 0
  public rectangle: Phaser.GameObjects.Rectangle
  public detectorRect: Phaser.Geom.Rectangle
  public wizard: Wizard

  public tickerLine: Phaser.GameObjects.Line

  constructor(game: Game, config: SpellTimelineConfig) {
    this.game = game
    this.wizard = config.wizard
    this.detectorRect = new Phaser.Geom.Rectangle(
      config.position.x,
      config.position.y,
      SpellTimeline.SPELL_TIMELINE_WIDTH,
      SpellTimeline.SPELL_TIMELINE_HEIGHT + 5
    )

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

  highlightRect() {
    this.rectangle.setStrokeStyle(2, 0xffff00)
  }

  dehighlightRect() {
    this.rectangle.setStrokeStyle(0)
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

  previewCardDrop(spellCard: SpellCard) {
    const startingTickMark = this.getTickMarkForRectPosition(spellCard)
    const startX = startingTickMark * (this.rectangle.displayWidth / 10) + this.rectangle.x
    spellCard.spellCardRect.setVisible(false)
    spellCard.spellTimelineRect.setOrigin(0)
    spellCard.spellTimelineRect.setPosition(startX, this.rectangle.y).setVisible(true).setAlpha(0.5)
    if (!this.canPlayCard(spellCard)) {
      spellCard.spellTimelineRect.setFillStyle(0xff0000)
    } else {
      spellCard.spellTimelineRect.setFillStyle(spellCard.cardColor)
    }
  }

  canPlayCard(spellCard: SpellCard) {
    // Check for overlaps
    const startingTickMark = this.getTickMarkForRectPosition(spellCard)
    const startX = startingTickMark * (this.rectangle.displayWidth / 10) + this.rectangle.x
    const endX = startX + spellCard.spellTimelineRect.displayWidth

    const keys = Object.keys(this.spellSequenceMapping)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const spell = this.spellSequenceMapping[key]
      const tickMark = parseInt(key, 10)
      const spellStartX = tickMark * (this.rectangle.displayWidth / 10) + this.rectangle.x
      const spellEndX = spellStartX + spell.spellTimelineRect.displayWidth
      if ((startX >= spellStartX && startX < spellEndX) || endX < spellEndX) {
        return false
      }
    }
    return true
  }

  public addSpellToSpellSequence(spellCard: SpellCard) {
    spellCard.wizardRef = this.wizard
    const startingTickMark = this.getTickMarkForRectPosition(spellCard)
    this.spellSequenceMapping[startingTickMark.toString()] = spellCard
    const startX = startingTickMark * (this.rectangle.displayWidth / 10) + this.rectangle.x
    spellCard.spellTimelineRect
      .setPosition(startX, this.rectangle.y)
      .setVisible(true)
      .setOrigin(0)
      .setAlpha(0.8)
  }

  public getTickMarkForRectPosition(spellCard: SpellCard) {
    const spellTimelineRect = spellCard.spellTimelineRect
    const spellCardRect = spellCard.spellCardRect
    const startOfTimelineRectX = spellCardRect.x - spellTimelineRect.displayWidth / 2

    let rightMostTick = 0
    for (let i = 1; i < SpellTimeline.SPELL_TIMELINE_DURATION_SECONDS; i++) {
      const tickMarkStartX = i * (this.rectangle.displayWidth / 10)
      const endOfTimelineRectAtTick = tickMarkStartX + spellTimelineRect.displayWidth + 10
      if (
        endOfTimelineRectAtTick <= this.rectangle.x + this.rectangle.displayWidth &&
        startOfTimelineRectX >= tickMarkStartX
      ) {
        rightMostTick = i - 1
      }
    }

    return rightMostTick
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
    Object.keys(this.spellSequenceMapping).forEach((key: string) => {
      this.spellSequenceMapping[key].destroy()
    })
    this.spellSequenceMapping = {}
  }

  executeSpell(spell: SpellCard) {
    spell.windUp()
    this.game.time.delayedCall(spell.windUpDurationSec * 1000, () => {
      spell.execute()
      this.game.time.delayedCall(spell.executionDurationSec * 1000, () => {
        spell.aftermath()
      })
    })
  }

  orchestrateSpellSequence() {
    Object.keys(this.spellSequenceMapping).forEach((key) => {
      const tickerStartTime = parseInt(key)
      const spell = this.spellSequenceMapping[key]
      this.game.time.delayedCall(tickerStartTime * 1000, () => {
        this.executeSpell(spell)
      })
    })
  }
}
