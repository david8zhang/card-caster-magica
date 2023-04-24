import { Scene } from 'phaser'
import { Button } from '~/ui/Button'
import { Constants } from '~/utils/Constants'

export class MainMenu extends Scene {
  constructor() {
    super('main-menu')
  }

  create() {
    const mainMenuText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 3,
      'Card Caster',
      {
        fontSize: '75px',
        color: 'white',
      }
    )
    const mainMenuSubtitleText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      mainMenuText.y + mainMenuText.displayHeight,
      'Synchronize',
      {
        fontSize: '75px',
        color: 'white',
      }
    )

    mainMenuText.setWordWrapWidth(Constants.WINDOW_WIDTH)
    mainMenuText.setPosition(
      Constants.WINDOW_WIDTH / 2 - mainMenuText.displayWidth / 2,
      Constants.WINDOW_HEIGHT / 3
    )

    mainMenuSubtitleText.setPosition(
      Constants.WINDOW_WIDTH / 2 - mainMenuSubtitleText.displayWidth / 2,
      mainMenuSubtitleText.y
    )

    const playButton = new Button({
      text: 'Play',
      onClick: () => {
        this.scene.start('game')
      },
      scene: this,
      width: 200,
      height: 40,
      x: Constants.WINDOW_WIDTH / 2,
      y: mainMenuSubtitleText.y + mainMenuSubtitleText.displayHeight + 50,
      backgroundColor: 0x222222,
      textColor: 'white',
      fontSize: 20,
    })

    const tutorialButton = new Button({
      text: 'How to Play',
      onClick: () => {
        this.scene.start('game', {
          showTutorial: true,
        })
      },
      scene: this,
      width: 200,
      height: 40,
      x: Constants.WINDOW_WIDTH / 2,
      y: playButton.y + playButton.height + 20,
      backgroundColor: 0x222222,
      textColor: 'white',
      fontSize: 20,
    })
  }
}
