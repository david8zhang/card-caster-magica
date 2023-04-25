import Game from '~/scenes/Game'
import { Button } from '~/ui/Button'
import { Constants } from '~/utils/Constants'
import { SpellCard } from './spells/SpellCard'

export interface TutorialStep {
  textToShow: string
  onStart?: Function
  textStyle?: any
  textPosition?: any
}

export class Tutorial {
  private game: Game
  public nextButton!: Button
  public tutorialText!: Phaser.GameObjects.Text
  public tutorialStepIndex: number = 0
  public stepObjectMapping = {}
  public didCallSequenceCompleteCb: boolean = false

  public tutorialStepArr: TutorialStep[] = [
    {
      textToShow: 'Welcome to Card Caster: Synchronize',
      onStart: () => {
        const secondWizard = this.game.player.wizards[1]
        secondWizard.setVisible(false)
        const spellTimeline = this.game.player.spellTimelines[1]
        spellTimeline.deactivate()

        this.game.monster.sprite.setScale(12).setTexture('spider')

        this.game.player.startSequenceButton.setVisible(false)
        this.game.player.resetSequenceButton.setVisible(false)
      },
    },
    {
      textToShow: 'This is a spell card',
      onStart: () => {
        const tutorialSpellCard = this.game.player.drawCardForTutorial()
        this.stepObjectMapping['spellCard'] = tutorialSpellCard
        this.stepObjectMapping['spellCardPosition'] = {
          x: tutorialSpellCard.spellCardRect.x,
          y: tutorialSpellCard.spellCardRect.y,
        }
      },
    },
    {
      textToShow: 'In this game, every spell takes a set amount of time to cast',
    },
    {
      textToShow: 'Drag the spell card to the timeline',
      onStart: () => {
        const spellTimelineToHighlight = this.game.player.spellTimelines[0]
        spellTimelineToHighlight.highlightRect()
        this.nextButton.setVisible(false)

        const tutorialSpellCard = this.stepObjectMapping['spellCard'] as SpellCard
        const tutorialSpellCardPos = this.stepObjectMapping['spellCardPosition']
        const tutorialSpellCardRect = tutorialSpellCard.spellCardRect
        tutorialSpellCardRect.setInteractive({ draggable: true })

        const spellCardRectShadow = this.game.add
          .rectangle(
            tutorialSpellCardPos.x,
            tutorialSpellCardPos.y,
            tutorialSpellCardRect.width,
            tutorialSpellCardRect.height,
            tutorialSpellCard.cardColor
          )
          .setAlpha(0.5)

        const event = this.game.tweens.add({
          targets: [spellCardRectShadow],
          duration: 2000,
          x: {
            from: spellCardRectShadow.x,
            to: spellTimelineToHighlight.rectangle.x + 50,
          },
          y: {
            from: spellCardRectShadow.y,
            to: spellTimelineToHighlight.rectangle.y,
          },
          repeat: -1,
        })

        tutorialSpellCard.dragEndCallbacks.push(() => {
          this.game.tweens.remove(event)
          spellCardRectShadow.destroy()
          this.showNextStep()
        })
      },
    },
    {
      textToShow: 'Nice! The rectangles in the timeline show how long a spell takes',
      textStyle: {
        fontSize: '18px',
      },
      onStart: () => {
        const spellTimeline = this.game.player.spellTimelines[0]
        spellTimeline.dehighlightRect()
        this.nextButton.setVisible(true)
      },
    },
    {
      textToShow: 'Every spell can have up to 3 phases',
    },
    {
      textToShow: 'The wind up or "charge" phase',
      onStart: () => {
        const spellCard = this.stepObjectMapping['spellCard'] as SpellCard
        spellCard.spellTimelineWindUpRect.setStrokeStyle(5, 0xffff00, 1).setDepth(1000)
        const event = this.game.time.addEvent({
          delay: 500,
          callback: () => {
            spellCard.spellTimelineWindUpRect.isStroked =
              !spellCard.spellTimelineWindUpRect.isStroked
          },
          repeat: -1,
        })
        this.nextButton.clickHandlers.push(() => {
          spellCard.spellTimelineWindUpRect.isStroked = false
          event.destroy()
        })
      },
    },
    {
      textToShow: 'The execution phase',
      onStart: () => {
        this.nextButton.clickHandlers = [() => this.showNextStep()]
        const spellCard = this.stepObjectMapping['spellCard'] as SpellCard
        spellCard.spellTimelineExecutionRect.setStrokeStyle(5, 0xffff00, 1).setDepth(1000)
        const event = this.game.time.addEvent({
          delay: 500,
          callback: () => {
            spellCard.spellTimelineExecutionRect.isStroked =
              !spellCard.spellTimelineExecutionRect.isStroked
          },
          repeat: -1,
        })
        this.nextButton.clickHandlers.push(() => {
          spellCard.spellTimelineExecutionRect.isStroked = false
          event.destroy()
        })
      },
    },
    {
      textToShow: "And an optional status effect phase (we'll talk about that later)",
    },
    {
      textToShow: 'In this game, you arrange spells in the timeline to plan your attack',
    },
    {
      textToShow:
        'Try dragging another spell to the timeline. Move left and right to adjust the timing. Spell wind up and execution phases cannot overlap!',
      textStyle: {
        fontSize: '18px',
        color: 'black',
      },
      onStart: () => {
        this.nextButton.setVisible(false)
        const secondSpell = this.game.player.drawCardForTutorial()
        secondSpell.spellCardRect.setInteractive({ draggable: true })
        secondSpell.dragEndCallbacks.push(() => {
          this.showNextStep()
        })
      },
    },
    {
      textToShow: 'Nice! Now click the "Start Sequence" button at the bottom to start your attack.',
      onStart: () => {
        this.nextButton.setVisible(false)
        this.game.player.startSequenceButton.setVisible(true)
        this.game.player.startSequenceButton.clickHandlers = [
          () => {
            this.game.player.startSequencesTutorial(() => {
              this.showNextStep()
            })
          },
        ]
      },
    },
    {
      textToShow: "Great! Now let's talk about status effects",
      onStart: () => {
        this.game.player.isPlayingSequence = false
        this.nextButton.setVisible(true)
        this.game.player.spellTimelines[0].clear()
      },
    },
    {
      textToShow: 'Drag the spell below to the timeline',
      onStart: () => {
        this.nextButton.setVisible(false)
        const spellCard = this.game.player.drawCardForTutorial('Fireball')
        this.stepObjectMapping['spellCard'] = spellCard
        spellCard.dragEndCallbacks.push(() => {
          this.showNextStep()
        })
        spellCard.spellCardRect.setInteractive({ draggable: true })
      },
    },
    {
      textToShow:
        'Notice this little rectangle? That\'s a status effect! In this case, the "ignite" effect',
      onStart: () => {
        this.nextButton.setVisible(true)
        const spellCard = this.stepObjectMapping['spellCard'] as SpellCard
        spellCard.spellTimelineStatusEffectRect!.setStrokeStyle(5, 0xffff00, 1).setDepth(1000)
        const event = this.game.time.addEvent({
          delay: 500,
          callback: () => {
            spellCard.spellTimelineStatusEffectRect!.isStroked =
              !spellCard.spellTimelineStatusEffectRect!.isStroked
          },
          repeat: -1,
        })
        this.nextButton.clickHandlers.push(() => {
          spellCard.spellTimelineStatusEffectRect!.isStroked = false
          event.destroy()
        })
      },
    },
    {
      textToShow: 'Try playing your attack to see what it does!',
      onStart: () => {
        this.nextButton.setVisible(false)
        this.game.player.startSequenceButton.setVisible(true)
      },
    },
    {
      textToShow: 'Nice! Watch that monster burn!',
      onStart: () => {
        this.game.player.isPlayingSequence = false
        this.nextButton.setVisible(true)
        this.game.player.spellTimelines[0].clear()
        this.game.player.startSequenceButton.setVisible(false)
      },
    },
    {
      textToShow:
        'Status effects can be overlapped with the wind up and execution phases of spells.',
    },
    {
      textToShow: 'You can also combine status effects for some cool effects!',
    },
    {
      textToShow: 'Try casting water blast, then overlap it with frost wind.',
      onStart: () => {
        const spellCard1 = this.game.player.drawCardForTutorial('WaterBlast')
        spellCard1.spellCardRect.setInteractive({ draggable: true })
        const spellCard2 = this.game.player.drawCardForTutorial('FrostWind')
        spellCard2.spellCardRect.setInteractive({ draggable: true })

        const validateSpellCardOrder = () => {
          const spellTimeline = this.game.player.spellTimelines[0]
          const keys = Object.keys(spellTimeline.spellSequenceMapping)
          const timeBetweenSpells = Math.abs(parseInt(keys[0]) - parseInt(keys[1]))
          return timeBetweenSpells <= 2
        }

        spellCard1.dragEndCallbacks.push(() => {
          if (spellCard2.wasPlayed) {
            if (validateSpellCardOrder()) {
              this.showNextStep()
            } else {
              this.game.player.resetSequences()
            }
          }
        })
        spellCard2.dragEndCallbacks.push(() => {
          if (spellCard1.wasPlayed) {
            if (validateSpellCardOrder()) {
              this.showNextStep()
            } else {
              this.game.player.resetSequences()
            }
          }
        })
      },
    },
    {
      textToShow: 'Now try playing the attack!',
      onStart: () => {
        this.game.player.startSequenceButton.setVisible(true)
        this.nextButton.setVisible(false)
      },
    },
    {
      textToShow: 'Awesome! Combining the "chill" and "wet" effects freeze the monster solid',
      onStart: () => {
        this.game.player.spellTimelines[0].clear()
        this.game.player.isPlayingSequence = false
        this.nextButton.setVisible(true)
      },
    },
    {
      textToShow:
        'Now you know the basics! Try combo-ing together multiple spells to defeat the monster! (Use the reset button to redo spells)',
      textStyle: {
        fontSize: '16px',
      },
      onStart: () => {
        const wizard2 = this.game.player.wizards[1]
        wizard2.setVisible(true)
        const timeline2 = this.game.player.spellTimelines[1]
        timeline2.activate()
        this.game.monster.setMaxHealth(50)
        const spells: SpellCard[] = []
        spells.push(this.game.player.drawCardForTutorial('Fireball'))
        spells.push(this.game.player.drawCardForTutorial('PoisonGas'))
        spells.push(this.game.player.drawCardForTutorial('RockThrow'))
        spells.push(this.game.player.drawCardForTutorial('FrostWind'))
        spells.push(this.game.player.drawCardForTutorial('WaterBlast'))
        spells.forEach((spell) => {
          spell.spellCardRect.setInteractive({ draggable: true })
        })
        this.game.player.resetSequenceButton.setVisible(true)
        this.game.player.startSequenceButton.setVisible(true)
        this.game.player.startSequenceButton.clickHandlers = [
          () => {
            this.game.player.isPlayingSequence = false
            this.game.player.startSequencesTutorial(() => {
              if (!this.didCallSequenceCompleteCb) {
                this.didCallSequenceCompleteCb = true
                this.showNextStep()
              }
            })
          },
        ]
      },
    },
    {
      textToShow: "Nicely done! Now you're ready to take on some real monsters!",
      onStart: () => {
        this.game.player.resetSequenceButton.setVisible(false)
        this.game.player.spellTimelines.forEach((timeline) => {
          timeline.clear()
        })
      },
    },
    {
      textToShow: '',
      onStart: () => {
        this.game.scene.start('game', { showTutorial: false })
      },
    },
  ]

  constructor(game: Game) {
    this.game = game
    this.setupTutorialElements()
  }

  start() {
    this.nextButton.setVisible(true)
    this.tutorialText.setVisible(true)
    this.showNextStep()
  }

  showNextStep() {
    const currStep = this.tutorialStepArr[this.tutorialStepIndex]
    this.tutorialText.setText(currStep.textToShow)
    if (currStep.onStart) {
      currStep.onStart()
    }
    if (currStep.textStyle) {
      this.tutorialText.setStyle(currStep.textStyle)
    } else {
      this.tutorialText.setStyle({
        fontSize: '20px',
        color: 'black',
      })
    }

    if (currStep.textPosition) {
      this.tutorialText.setPosition(currStep.textPosition.x, currStep.textPosition.y)
    } else {
      this.tutorialText.setPosition(25, Constants.MAP_HEIGHT - 50)
    }
    this.tutorialStepIndex++
  }

  setupTutorialElements() {
    this.tutorialText = this.game.add.text(
      25,
      Constants.MAP_HEIGHT - 50,
      'Welcome to Card Caster: Synchronize!',
      {
        fontSize: '20px',
        color: 'black',
      }
    )
    this.tutorialText.setWordWrapWidth(Constants.MAP_WIDTH - 150)

    this.nextButton = new Button({
      text: 'Next',
      onClick: () => {
        this.showNextStep()
      },
      scene: this.game,
      width: 100,
      height: 40,
      x: Constants.WINDOW_WIDTH - 75,
      y: Constants.MAP_HEIGHT - 40,
      backgroundColor: 0x222222,
      textColor: 'white',
      fontSize: 20,
    })

    this.nextButton.setVisible(false)
    this.tutorialText.setVisible(false)
  }
}
