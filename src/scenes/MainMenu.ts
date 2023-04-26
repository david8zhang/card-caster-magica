import { Scene } from 'phaser'
import { Button } from '~/ui/Button'
import { Constants } from '~/utils/Constants'

export class MainMenu extends Scene {
  constructor() {
    super('main-menu')
  }

  create() {
    this.sound.pauseOnBlur = false
    this.sound.play('bgm', {
      loop: true,
      volume: 0.4,
    })

    const bgImage = this.add.image(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 2,
      'splash-art'
    )

    const mainMenuText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 4,
      'CARDCASTER',
      {
        fontSize: '75px',
        color: 'white',
        fontFamily: 'Cambria',
      }
    )
    mainMenuText.setStroke('#ed4774', 15)

    const mainMenuSubtitleText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      mainMenuText.y + mainMenuText.displayHeight,
      'Synchronize',
      {
        fontSize: '200px',
        color: 'white',
        fontFamily: 'Althea',
      }
    )
    mainMenuSubtitleText.setStroke('#ed4774', 25)

    mainMenuText.setWordWrapWidth(Constants.WINDOW_WIDTH)
    mainMenuText.setPosition(
      Constants.WINDOW_WIDTH / 2 - mainMenuText.displayWidth / 2 + 200,
      Constants.WINDOW_HEIGHT / 4 + 50
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
