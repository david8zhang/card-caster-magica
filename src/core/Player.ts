import Game from '~/scenes/Game'
import { Wizard } from './Wizard'
import { SpellTimeline } from './SpellTimeline'
import { Constants } from '~/utils/Constants'
import { SpellCard } from './spells/SpellCard'
import { FireballCard } from './spells/FireballCard'

export class Player {
  private game: Game
  private wizards: Wizard[] = []
  private wizardToTimelineMapping: {
    [key: string]: SpellTimeline
  } = {}
  private currentHand: SpellCard[] = []
  public static NUM_CARDS_IN_HAND = 5
  private cardToPlay: SpellCard | null = null

  constructor(game: Game) {
    this.game = game
    this.createWizards()
    this.drawCards()
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
      })
      this.game.add.text(10, spellTimelineStartY + timeline.rectangle.height / 2, config.name, {
        fontSize: '12px',
        color: 'white',
      })
      spellTimelineStartY += 75
      this.wizardToTimelineMapping[wizard.name] = timeline
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

  updateCardsInHand() {
    const unplayedCards = this.currentHand.filter((card) => !card.wasPlayed)
    let startX = Constants.MAP_WIDTH / 2 - (SpellCard.SPELL_CARD_WIDTH * unplayedCards.length) / 2
    for (let i = 0; i < unplayedCards.length; i++) {
      const spellCard = unplayedCards[i]
      spellCard.spellCardRect.setPosition(startX, Constants.WINDOW_HEIGHT - 75).setVisible(true)
      startX += 85
    }
  }

  selectCardToPlay(spellCard: SpellCard) {
    if (this.cardToPlay) {
      this.cardToPlay.dehighlight()
    }
    this.cardToPlay = spellCard
    this.cardToPlay.highlight()
  }

  playCard(spellTimeline: SpellTimeline) {
    if (this.cardToPlay && spellTimeline.canPlayCard(this.cardToPlay)) {
      spellTimeline.addSpellToSpellSequence(this.cardToPlay)
      this.cardToPlay.onPlay()
      this.updateCardsInHand()
    }
  }
}
