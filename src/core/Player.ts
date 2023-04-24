import Game from '~/scenes/Game'
import { Wizard, WizardConfig } from './Wizard'
import { SpellTimeline } from './SpellTimeline'
import { Constants } from '~/utils/Constants'
import { SpellCard } from './spells/SpellCard'
import { Button } from '~/ui/Button'
import { SpellTypes } from '~/utils/SpellTypes'
import { TutorialSpellCard } from './spells/TutorialSpellCard'
import { FireballCard } from './spells/FireballCard'
import { PoisonGasCard } from './spells/PoisonGasCard'
import { WaterBlastCard } from './spells/WaterBlastCard'
import { FrostWindCard } from './spells/FrostWindCard'
import { RockThrowCard } from './spells/RockThrowCard'

export interface PlayerConfig {
  wizardConfig: WizardConfig[]
}

export class Player {
  public static NUM_CARDS_TO_DRAW = 3

  private game: Game
  private currentHand: SpellCard[] = []
  public startSequenceButton!: Button
  public resetSequenceButton!: Button

  private hasTimelineFinishedBeenCalled: boolean = false
  public isPlayingSequence: boolean = false

  public spellTimelines: SpellTimeline[] = []
  public wizards: Wizard[] = []

  constructor(game: Game) {
    this.game = game
    this.createWizards()
    this.createStartButton()
    this.createResetButton()
  }

  createStartButton() {
    this.startSequenceButton = new Button({
      x: Constants.WINDOW_WIDTH - 100,
      y: Constants.WINDOW_HEIGHT - 35,
      width: 175,
      height: 50,
      text: 'Start Sequences',
      onClick: () => {
        this.startSequences()
      },
      scene: this.game,
      backgroundColor: 0x222222,
      textColor: 'white',
    })
  }

  createResetButton() {
    this.resetSequenceButton = new Button({
      x: Constants.WINDOW_WIDTH - 100,
      y: Constants.WINDOW_HEIGHT - 90,
      width: 175,
      height: 50,
      text: 'Reset Sequence',
      onClick: () => {
        this.resetSequences()
      },
      scene: this.game,
      backgroundColor: 0x222222,
      textColor: 'white',
    })
  }

  resetSequences() {
    this.spellTimelines.forEach((spellTimeline) => {
      Object.keys(spellTimeline.spellSequenceMapping).forEach((key) => {
        const spellCard = spellTimeline.spellSequenceMapping[key]
        spellCard.wasPlayed = false
        spellCard.hideTimelineRect()
      })
      spellTimeline.removeAllCards()
    })
    this.updateCardsInHand()
  }

  startSequences() {
    this.startSequenceButton.setVisible(false)
    this.isPlayingSequence = true
    this.spellTimelines.forEach((timeline) => {
      if (timeline.isActive) {
        timeline.startTicker(() => {
          this.onTimelineFinished()
        })
        timeline.orchestrateSpellSequence()
      }
    })
  }

  startSequencesTutorial(cb: Function) {
    this.startSequenceButton.setVisible(false)
    this.isPlayingSequence = true
    this.spellTimelines.forEach((timeline) => {
      timeline.dehighlightRect()
      if (timeline.isActive) {
        timeline.startTicker(() => {
          cb()
        })
        timeline.orchestrateSpellSequence()
      }
    })
  }

  createWizards() {
    const wizardConfigs = Constants.PLAYER_WIZARD_CONFIGS
    let spellTimelineStartY = Constants.MAP_HEIGHT + 10

    wizardConfigs.forEach((config) => {
      const wizard = new Wizard(this.game, config)
      const timeline = new SpellTimeline(this.game, {
        position: {
          x: 100,
          y: spellTimelineStartY,
        },
        wizard,
      })
      this.spellTimelines.push(timeline)
      this.wizards.push(wizard)
      spellTimelineStartY += 70
    })
  }

  drawCards(numCardsToDraw: number = Player.NUM_CARDS_TO_DRAW) {
    let startX = Constants.MAP_WIDTH / 2 - (SpellCard.SPELL_CARD_WIDTH * numCardsToDraw) / 2
    const randomCardTypes = SpellTypes
    for (let i = 0; i < numCardsToDraw; i++) {
      const SpellCardClass = randomCardTypes[Phaser.Math.Between(0, randomCardTypes.length - 1)]
      const spellCard = new SpellCardClass(this.game)
      if (spellCard) {
        spellCard.spellCardRect.setVisible(true)
        spellCard.setCardPosition(startX, Constants.WINDOW_HEIGHT - 75)
        startX += 85
        this.currentHand.push(spellCard)
      }
    }
  }

  drawCardForTutorial(cardType?: string) {
    let startX = Constants.MAP_WIDTH / 2 - SpellCard.SPELL_CARD_WIDTH / 2
    let SpellCardClass = TutorialSpellCard
    if (cardType === 'Fireball') {
      SpellCardClass = FireballCard
    }
    if (cardType === 'PoisonGas') {
      SpellCardClass = PoisonGasCard
    }
    if (cardType === 'WaterBlast') {
      SpellCardClass = WaterBlastCard
    }
    if (cardType === 'FrostWind') {
      SpellCardClass = FrostWindCard
    }
    if (cardType === 'RockThrow') {
      SpellCardClass = RockThrowCard
    }
    const spellCard = new SpellCardClass(this.game)
    spellCard.spellCardRect.setVisible(true)
    spellCard.spellCardRect.removeInteractive()
    spellCard.setCardPosition(startX, Constants.WINDOW_HEIGHT - 75)
    this.currentHand.push(spellCard)
    this.updateCardsInHand()
    return spellCard
  }

  onTimelineFinished() {
    if (!this.hasTimelineFinishedBeenCalled) {
      this.hasTimelineFinishedBeenCalled = true
      this.endTurn()
    }
  }

  endTurn() {
    this.spellTimelines.forEach((timeline) => {
      timeline.clear()
    })
    this.game.switchTurn()
  }

  updateCardsInHand() {
    const unplayedCards = this.currentHand.filter((card) => !card.wasPlayed)
    let startX = Constants.MAP_WIDTH / 2 - (SpellCard.SPELL_CARD_WIDTH * unplayedCards.length) / 2
    for (let i = 0; i < unplayedCards.length; i++) {
      const spellCard = unplayedCards[i]
      spellCard.spellCardRect.setVisible(true)
      spellCard.setCardPosition(startX, Constants.WINDOW_HEIGHT - 75)
      startX += 85
    }
  }

  startTurn() {
    this.hasTimelineFinishedBeenCalled = false
    this.isPlayingSequence = false
    this.startSequenceButton.setVisible(true)
    this.drawCards()
    this.updateCardsInHand()
  }

  playCard(spellTimeline: SpellTimeline, spellCardToPlay: SpellCard) {
    if (this.isPlayingSequence) {
      return
    }
    spellTimeline.addSpellToSpellSequence(spellCardToPlay)
    spellCardToPlay.onPlay()
    this.updateCardsInHand()
  }
}
