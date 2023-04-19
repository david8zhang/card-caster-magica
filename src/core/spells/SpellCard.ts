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

  public spellTimelineRect!: Phaser.GameObjects.Rectangle
  public spellCardRect!: Phaser.GameObjects.Rectangle
  public wasPlayed: boolean = false
  public wizardRef: Wizard | null = null

  public cardColor: number

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
    const spellCardTimelineRectWidth = totalDurationSec * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    this.spellTimelineRect = this.game.add
      .rectangle(0, 0, spellCardTimelineRectWidth, SpellTimeline.SPELL_TIMELINE_HEIGHT - 20)
      .setFillStyle(this.cardColor, 0.5)
      .setStrokeStyle(2, 0x222222, 1)
      .setVisible(false)
  }

  public setupCardRect(): void {
    this.spellCardRect = this.game.add
      .rectangle(0, 0, SpellCard.SPELL_CARD_WIDTH, SpellCard.SPELL_CARD_HEIGHT, this.cardColor)
      .setVisible(false)
      .setInteractive()
      .on('pointerdown', () => {
        this.game.player.selectCardToPlay(this)
      })
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

  public get totalDurationSec() {
    return this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec
  }

  public destroy() {
    this.spellCardRect.destroy()
    this.spellTimelineRect.destroy()
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
