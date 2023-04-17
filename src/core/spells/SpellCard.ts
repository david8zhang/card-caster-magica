import Game from '~/scenes/Game'
import { Wizard } from '../Wizard'
import { SpellTimeline } from '../SpellTimeline'

export interface SpellCardConfig {
  name: string
  windUpDurationSec: number
  executionDurationSec: number
  aftermathDurationSec: number
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

  constructor(game: Game, config: SpellCardConfig) {
    this.game = game
    this.windUpDurationSec = config.windUpDurationSec
    this.executionDurationSec = config.executionDurationSec
    this.aftermathDurationSec = config.aftermathDurationSec
    this.name = config.name

    this.setupTimelineRect()
    this.setupCardRect()
  }

  public setupTimelineRect() {
    const totalDurationSec =
      this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec
    const spellCardTimelineRectWidth = totalDurationSec * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
    this.spellTimelineRect = this.game.add
      .rectangle(0, 0, spellCardTimelineRectWidth)
      .setVisible(false)
  }

  public abstract setupCardRect(): void

  public get totalDurationSec() {
    return this.windUpDurationSec + this.executionDurationSec + this.aftermathDurationSec
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
