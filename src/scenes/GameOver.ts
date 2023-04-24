import { Scene } from 'phaser'
import { Button } from '~/ui/Button'
import { Constants, Sides } from '~/utils/Constants'

export class GameOver extends Scene {
  private winningSide!: Sides

  constructor() {
    super('gameover')
  }

  init(data: { winningSide: Sides }) {
    this.winningSide = data.winningSide
  }

  create() {
    const message = this.winningSide === Sides.PLAYER ? 'You won!' : 'You lost...'
    const gameOverText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 2,
      message,
      {
        fontSize: '50px',
      }
    )
    gameOverText.setPosition(
      Constants.WINDOW_WIDTH / 2 - gameOverText.displayWidth / 2,
      Constants.WINDOW_HEIGHT / 3
    )
    const subtitle = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 2,
      'Thanks for playing!',
      {
        fontSize: '30px',
      }
    )
    subtitle.setPosition(
      Constants.WINDOW_WIDTH / 2 - subtitle.displayWidth / 2,
      gameOverText.y + gameOverText.displayHeight + 10
    )

    const button = new Button({
      text: 'Play Again',
      onClick: () => {
        this.scene.start('game')
      },
      scene: this,
      width: 200,
      height: 40,
      x: Constants.WINDOW_WIDTH / 2,
      y: subtitle.y + subtitle.displayHeight + 50,
      backgroundColor: 0x222222,
      textColor: 'white',
      fontSize: 20,
    })
  }
}
