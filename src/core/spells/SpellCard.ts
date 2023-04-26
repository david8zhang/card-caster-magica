import Game from '~/scenes/Game'
import { Wizard } from '../Wizard'
import { SpellTimeline } from '../SpellTimeline'
import { Status, StatusTypes } from '../status/Status'
import { Constants } from '~/utils/Constants'
import { StatusFactory } from '../status/StatusFactory'

export interface SpellCardConfig {
  name: string
  windUpDurationSec: number
  executionDurationSec: number
  cardColor: number
  imageSrc: string
  descText: string
  statusEffect?: StatusTypes
}

export abstract class SpellCard {
  protected game: Game
  public windUpDurationSec: number
  public executionDurationSec: number
  public statusEffect: StatusTypes | null = null

  public static SPELL_CARD_WIDTH = 95
  public static SPELL_CARD_HEIGHT = 150

  public name: string
  public descText: string

  public spellTimelineWindUpRect!: Phaser.GameObjects.Rectangle
  public spellTimelineExecutionRect!: Phaser.GameObjects.Rectangle
  public spellTimelineStatusEffectRect: Phaser.GameObjects.Rectangle | null = null

  // Card
  public spellCardBg!: Phaser.GameObjects.Rectangle
  public spellCardRect!: Phaser.GameObjects.Rectangle
  public spellImage!: Phaser.GameObjects.Image
  public spellBorder!: Phaser.GameObjects.Rectangle

  // Description text
  public spellWindUpText!: Phaser.GameObjects.Text
  public spellExecutionText!: Phaser.GameObjects.Text
  public descriptionText!: Phaser.GameObjects.Text

  public imageSrc: string
  public chargingSprite: Phaser.GameObjects.Sprite

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
    this.imageSrc = config.imageSrc
    this.descText = config.descText
    if (config.statusEffect) {
      this.statusEffect = config.statusEffect
    }
    this.setupTimelineRect()
    this.setupCardRect()
    this.chargingSprite = this.game.add.sprite(0, 0, '').setVisible(false)
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
      const statusEffectObj = StatusFactory.statusMappingClasses[this.statusEffect]
      const statusEffectRectWidth =
        (statusEffectObj.duration / 1000) * (SpellTimeline.SPELL_TIMELINE_WIDTH / 10)
      this.spellTimelineStatusEffectRect = this.game.add
        .rectangle(0, 0, statusEffectRectWidth, SpellTimeline.SPELL_TIMELINE_HEIGHT - 20)
        .setFillStyle(statusEffectObj.iconColor || 0x000000, 0.6)
        .setVisible(false)
    }
  }

  public setTimelineRectPositions(x: number, y: number) {
    this.spellTimelineWindUpRect.setOrigin(0)
    this.spellTimelineExecutionRect.setOrigin(0)
    if (this.spellTimelineStatusEffectRect) {
      this.spellTimelineStatusEffectRect.setOrigin(0)
    }
    this.spellTimelineWindUpRect.setPosition(x, y).setVisible(true).setAlpha(0.6)
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
    this.spellCardBg = this.game.add
      .rectangle(0, 0, SpellCard.SPELL_CARD_WIDTH, SpellCard.SPELL_CARD_HEIGHT, 0xffffff)
      .setStrokeStyle(6, this.cardColor)
      .setVisible(false)
      .setOrigin(0, 0.5)
    this.spellCardRect = this.game.add
      .rectangle(0, 0, SpellCard.SPELL_CARD_WIDTH, SpellCard.SPELL_CARD_HEIGHT, this.cardColor)
      .setAlpha(0.8)
      .setVisible(false)
      .setInteractive({ draggable: true })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.hoverCard()
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.unHoverCard()
      })
      .setOrigin(0, 0.5)

    this.spellBorder = this.game.add
      .rectangle(0, 0, 79, 79, 0x000000)
      .setVisible(false)
      .setOrigin(0, 0.5)
    this.spellImage = this.game.add.image(0, 0, this.imageSrc).setVisible(false).setOrigin(0, 0.5)
    this.spellCardRect.setData('ref', this)
  }

  public setCardPosition(x: number, y: number, setPreDrag: boolean = true) {
    if (setPreDrag) {
      this.preDragPosition = { x, y }
    }
    this.showSpellCard()
    this.spellCardBg.setPosition(x, y)
    this.spellCardRect.setPosition(x, y)
    this.spellImage.setPosition(x + 9, y - 28)
    this.spellBorder.setPosition(this.spellImage.x - 1, this.spellImage.y)
  }

  public onPlay() {
    this.hideSpellCard()
    this.wasPlayed = true
  }

  public hoverCard() {
    this.spellCardBg.setStrokeStyle(6, 0xffff00)
  }

  public unHoverCard() {
    this.spellCardBg.setStrokeStyle(6, this.cardColor)
  }

  public handleDrag(dragX: number, dragY: number) {
    this.setCardPosition(dragX, dragY, false)
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
      this.showSpellCard()
    }
    this.spellTimelineToDropOn = newSpellTimeline
  }

  get spellTimelineDisplayWidth() {
    return this.spellTimelineWindUpRect.displayWidth + this.spellTimelineExecutionRect.displayWidth
  }

  hideSpellCard() {
    this.spellCardBg.setVisible(false)
    this.spellCardRect.setVisible(false)
    this.spellBorder.setVisible(false)
    this.spellImage.setVisible(false)
  }

  showSpellCard() {
    this.spellCardBg.setVisible(true)
    this.spellCardRect.setVisible(true)
    this.spellBorder.setVisible(true)
    this.spellImage.setVisible(true)
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
        this.setCardPosition(this.preDragPosition.x, this.preDragPosition.y)
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
    if (this.wizardRef) {
      this.chargingSprite
        .setTexture(this.wizardRef.sprite.texture.key)
        .setTintFill(this.cardColor)
        .setAlpha(0)
        .setPosition(this.wizardRef.sprite.x, this.wizardRef.sprite.y)
        .setScale(3)

      this.game.tweens.add({
        targets: [this.chargingSprite],
        duration: this.windUpDurationSec * 1000,
        alpha: {
          from: 0,
          to: 1,
        },
        onStart: () => {
          this.chargingSprite.setVisible(true)
        },
        onComplete: () => {
          this.chargingSprite.setVisible(false)
        },
      })
      return
    }
  }

  public execute() {
    return
  }

  public aftermath() {
    return
  }
}
