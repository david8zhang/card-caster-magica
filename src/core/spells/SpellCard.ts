import Game from '~/scenes/Game'
import { Wizard } from '../Wizard'
import { SpellTimeline } from '../SpellTimeline'
import { Status, StatusTypes } from '../status/Status'

export interface SpellCardConfig {
  name: string
  windUpDurationSec: number
  executionDurationSec: number
  cardColor: number
  statusEffect?: StatusTypes
}

export abstract class SpellCard {
  protected game: Game
  public windUpDurationSec: number
  public executionDurationSec: number
  public statusEffect: StatusTypes | null = null

  public static SPELL_CARD_WIDTH = 75
  public static SPELL_CARD_HEIGHT = 125

  public name: string

  public spellTimelineWindUpRect!: Phaser.GameObjects.Rectangle
  public spellTimelineExecutionRect!: Phaser.GameObjects.Rectangle
  public spellTimelineStatusEffectRect: Phaser.GameObjects.Rectangle | null = null

  public spellCardRect!: Phaser.GameObjects.Rectangle
  public wasPlayed: boolean = false
  public wizardRef: Wizard | null = null
  public cardColor: number
  public spellTimelineToDropOn: SpellTimeline | null = null
  public preDragPosition: { x: number; y: number } | null = null
  public dragEndCallbacks: Function[] = []

  constructor(game: Game, config: SpellCardConfig) {
    this.game = game
    this.windUpDurationSec = config.windUpDurationSec
    this.executionDurationSec = config.executionDurationSec
    this.name = config.name
    this.cardColor = config.cardColor
    if (config.statusEffect) {
      this.statusEffect = config.statusEffect
    }
    this.setupTimelineRect()
    this.setupCardRect()
  }

  public setupTimelineRect() {
    const spellCardTimelineWindUpRectWidth =
      this.windUpDurationSec * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    this.spellTimelineWindUpRect = this.game.add
      .rectangle(0, 0, spellCardTimelineWindUpRectWidth, SpellTimeline.SPELL_TIMELINE_HEIGHT - 20)
      .setFillStyle(this.cardColor, 0.4)
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
      .setVisible(false)

    if (this.statusEffect) {
      const statusEffectObj = this.game.statusFactory.statusMapping[this.statusEffect] as Status
      const statusEffectRectWidth =
        (statusEffectObj.duration / 1000) * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
      this.spellTimelineStatusEffectRect = this.game.add
        .rectangle(0, 0, statusEffectRectWidth, SpellTimeline.SPELL_TIMELINE_HEIGHT - 20)
        .setFillStyle(statusEffectObj.iconColor || 0x000000, 0.4)
        .setVisible(false)
    }
  }

  public setTimelineRectPositions(x: number, y: number) {
    this.spellTimelineWindUpRect.setOrigin(0)
    this.spellTimelineExecutionRect.setOrigin(0)
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect.setOrigin(0)
    }
    this.spellTimelineWindUpRect.setPosition(x, y).setVisible(true).setAlpha(0.4)
    this.spellTimelineExecutionRect
      .setPosition(x + this.spellTimelineWindUpRect.displayWidth, y)
      .setVisible(true)
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect
        .setPosition(
          this.spellTimelineExecutionRect.x + this.spellTimelineExecutionRect.displayWidth,
          y
        )
        .setVisible(true)
    }
  }

  public hideTimelineRect() {
    this.spellTimelineWindUpRect.setVisible(false)
    this.spellTimelineExecutionRect.setVisible(false)
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect.setVisible(false)
    }
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
      if (spellTimeline.isActive && spellTimeline.detectorRect.contains(dragX, dragY)) {
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
      (this.windUpDurationSec + this.executionDurationSec) *
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
      this.dragEndCallbacks.forEach((cb) => {
        cb()
      })
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
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect.setAlpha(alpha * 0.25)
    }
  }

  public get totalDurationSec() {
    return this.windUpDurationSec + this.executionDurationSec
  }

  public destroy() {
    this.spellCardRect.destroy()
    this.spellTimelineWindUpRect.destroy()
    this.spellTimelineExecutionRect.destroy()
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect.destroy()
    }
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
