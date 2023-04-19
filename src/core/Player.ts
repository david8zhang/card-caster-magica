import Game from '~/scenes/Game'
import { Wizard } from './Wizard'
import { SpellTimeline } from './SpellTimeline'
import { Constants } from '~/utils/Constants'
import { SpellCard } from './spells/SpellCard'
import { FireballCard } from './spells/FireballCard'
import { Button } from '~/ui/Button'

export class Player {
  public static NUM_CARDS_IN_HAND = 5

  private game: Game
  public wizards: Wizard[] = []
  private spellTimelines: SpellTimeline[] = []

  private currentHand: SpellCard[] = []
  private cardToPlay: SpellCard | null = null
  private startSequenceButton!: Button

  private hasTimelineFinishedBeenCalled: boolean = false
  private isPlayingSequence: boolean = false

  constructor(game: Game) {
    this.game = game
    this.createWizards()
    this.drawCards()
    this.createStartButton()
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

  startSequences() {
    this.currentHand = []
    this.startSequenceButton.setVisible(false)
    this.isPlayingSequence = true
    this.spellTimelines.forEach((timeline) => {
      timeline.startTicker()
      timeline.processNextSpell()
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
      this.game.add.text(10, spellTimelineStartY + timeline.rectangle.height / 2, config.name, {
        fontSize: '12px',
        color: 'white',
      })
      spellTimelineStartY += 75
    })
  }

  drawCards() {
    let startX =
      Constants.MAP_WIDTH / 2 - (SpellCard.SPELL_CARD_WIDTH * Player.NUM_CARDS_IN_HAND) / 2
    for (let i = 0; i < Player.NUM_CARDS_IN_HAND; i++) {
      const spellCard = new FireballCard(this.game)
      spellCard.spellCardRect.setPosition(startX, Constants.WINDOW_HEIGHT - 75).setVisible(true)
      startX += 85
      this.currentHand.push(spellCard)
    }
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
      spellCard.spellCardRect.setPosition(startX, Constants.WINDOW_HEIGHT - 75).setVisible(true)
      startX += 85
    }
  }

  startTurn() {
    this.isPlayingSequence = false
    this.startSequenceButton.setVisible(true)
    this.drawCards()
  }

  selectCardToPlay(spellCard: SpellCard) {
    if (this.isPlayingSequence) {
      return
    }

    if (this.cardToPlay) {
      this.cardToPlay.dehighlight()
    }
    this.cardToPlay = spellCard
    this.cardToPlay.highlight()
  }

  playCard(spellTimeline: SpellTimeline) {
    if (this.isPlayingSequence) {
      return
    }
    if (this.cardToPlay && spellTimeline.canPlayCard(this.cardToPlay)) {
      spellTimeline.addSpellToSpellSequence(this.cardToPlay)
      this.cardToPlay.onPlay()
      this.updateCardsInHand()
      this.cardToPlay = null
    }
  }
}
