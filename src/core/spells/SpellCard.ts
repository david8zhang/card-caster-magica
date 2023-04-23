import Game from '~/scenes/Game'
import { Wizard } from '../Wizard'
import { SpellTimeline } from '../SpellTimeline'

export interface SpellCardConfig {
  name: string
  windUpDurationSec: number
  executionDurationSec: number
  aftermathDurationSec: number
  cardColor: number
}

export abstract class SpellCard {
  protected game: Game
  public windUpDurationSec: number
  public executionDurationSec: number
  public aftermathDurationSec: number

  public static SPELL_CARD_WIDTH = 75
  public static SPELL_CARD_HEIGHT = 125

  public name: string

  public spellTimelineWindUpRect!: Phaser.GameObjects.Rectangle
  public spellTimelineExecutionRect!: Phaser.GameObjects.Rectangle

  public spellCardRect!: Phaser.GameObjects.Rectangle
  public wasPlayed: boolean = false
  public wizardRef: Wizard | null = null
  public cardColor: number
  public spellTimelineToDropOn: SpellTimeline | null = null
  public preDragPosition: { x: number; y: number } | null = null

  constructor(game: Game, config: SpellCardConfig) {
    this.game = game
    this.windUpDurationSec = config.windUpDurationSec
    this.executionDurationSec = config.executionDurationSec
    this.aftermathDurationSec = config.aftermathDurationSec
    this.name = config.name
    this.cardColor = config.cardColor

    this.setupTimelineRect()
    this.setupCardRect()
  }

  public setupTimelineRect() {
    const totalDurationSec =
      this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec
    const spellCardTimelineWindUpRectWidth =
      this.windUpDurationSec * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    this.spellTimelineWindUpRect = this.game.add
      .rectangle(0, 0, spellCardTimelineWindUpRectWidth, SpellTimeline.SPELL_TIMELINE_HEIGHT - 20)
      .setFillStyle(this.cardColor, 0.4)
      .setStrokeStyle(2, 0x222222, 1)
      .setVisible(false)

    const spellCardTimelineExecutionRectWidth =
      this.executionDurationSec * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    this.spellTimelineExecutionRect = this.game.add
      .rectangle(
        0,
        0,
        spellCardTimelineExecutionRectWidth,
        SpellTimeline.SPELL_TIMELINE_HEIGHT - 20
      )
      .setFillStyle(this.cardColor, 0.4)
      .setStrokeStyle(2, 0x222222, 1)
      .setVisible(false)
  }

  public setTimelineRectPositions(x: number, y: number) {
    this.spellTimelineWindUpRect.setOrigin(0)
    this.spellTimelineExecutionRect.setOrigin(0)

    this.spellTimelineWindUpRect.setPosition(x, y).setVisible(true).setAlpha(0.4)
    this.spellTimelineExecutionRect
      .setPosition(x + this.spellTimelineWindUpRect.displayWidth, y)
      .setVisible(true)
      .setAlpha(0.5)
  }

  public hideTimelineRect() {
    this.spellTimelineWindUpRect.setVisible(false)
    this.spellTimelineExecutionRect.setVisible(false)
  }

  public setupCardRect(): void {
    this.spellCardRect = this.game.add
      .rectangle(0, 0, SpellCard.SPELL_CARD_WIDTH, SpellCard.SPELL_CARD_HEIGHT, this.cardColor)
      .setVisible(false)
      .setInteractive({ draggable: true })
    this.spellCardRect.setData('ref', this)
  }

  public setCardPosition(x: number, y: number) {
    this.preDragPosition = { x, y }
    this.spellCardRect.setPosition(x, y)
  }

  public onPlay() {
    this.spellCardRect.setVisible(false)
    this.wasPlayed = true
  }

  public highlight(): void {
    this.spellCardRect.setStrokeStyle(2, 0xffff00)
  }

  public dehighlight(): void {
    this.spellCardRect.setStrokeStyle(0)
  }

  public handleDrag(dragX: number, dragY: number) {
    this.spellCardRect.setPosition(dragX, dragY)
    const spellTimelines = this.game.player.spellTimelines
    let newSpellTimeline: SpellTimeline | null = null
    spellTimelines.forEach((spellTimeline: SpellTimeline) => {
      if (spellTimeline.detectorRect.contains(dragX, dragY)) {
        spellTimeline.highlightRect()
        spellTimeline.previewCardDrop(this)
        newSpellTimeline = spellTimeline
      } else {
        spellTimeline.dehighlightRect()
      }
    })

    if (newSpellTimeline === null) {
      this.hideTimelineRect()
      this.spellCardRect.setVisible(true)
    }

    this.spellTimelineToDropOn = newSpellTimeline
  }

  public get spellTimelineRectWidth() {
    return (
      (this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec) *
      (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    )
  }

  public handleDragEnd() {
    if (
      this.spellTimelineToDropOn &&
      !this.game.player.isPlayingSequence &&
      this.spellTimelineToDropOn.canPlayCard(this)
    ) {
      this.game.player.playCard(this.spellTimelineToDropOn, this)
    } else {
      this.spellCardRect.setVisible(true)
      this.hideTimelineRect()
      if (this.preDragPosition) {
        this.spellCardRect.setPosition(this.preDragPosition.x, this.preDragPosition.y)
      }
    }
  }

  setTimelineRectFillStyle(color: number, alpha: number) {
    this.spellTimelineWindUpRect.setFillStyle(color, alpha * 0.75)
    this.spellTimelineExecutionRect.setFillStyle(color, alpha)
  }

  public get totalDurationSec() {
    return this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec
  }

  public destroy() {
    this.spellCardRect.destroy()
    this.spellTimelineWindUpRect.destroy()
    this.spellTimelineExecutionRect.destroy()
  }

  public windUp() {
    return
  }

  public execute() {
    return
  }

  public aftermath() {
    return
  }
}
