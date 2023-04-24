export interface ButtonConfig {
  scene: Phaser.Scene
  width: number
  height: number
  x: number
  y: number
  onClick: Function
  text: string
  backgroundColor: number
  textColor: string
  fontSize?: number
}

export class Button {
  private scene: Phaser.Scene
  private rectangle: Phaser.GameObjects.Rectangle
  private text: Phaser.GameObjects.Text
  public clickHandlers: Function[] = []

  constructor(config: ButtonConfig) {
    this.scene = config.scene
    this.rectangle = this.scene.add
      .rectangle(config.x, config.y, config.width, config.height, 0xffffff)
      .setAlpha(0.85)
      .setFillStyle(config.backgroundColor)
    this.text = this.scene.add.text(config.x, config.y, config.text, {
      fontSize: `${config.fontSize ? config.fontSize : 10}px`,
      color: config.textColor,
    })
    this.text.setPosition(
      this.text.x - this.text.displayWidth / 2,
      this.text.y - this.text.displayHeight / 2
    )
    this.clickHandlers.push(config.onClick)
    this.rectangle.setInteractive().on('pointerdown', () => {
      this.scene.tweens.add({
        targets: [this.rectangle],
        alpha: {
          from: 0.85,
          to: 0.5,
        },
        yoyo: true,
        duration: 50,
      })
      this.clickButton()
    })
  }

  clickButton() {
    this.clickHandlers.forEach((handler) => {
      handler()
    })
  }

  get x() {
    return this.rectangle.x
  }

  get y() {
    return this.rectangle.y
  }

  get height() {
    return this.rectangle.displayHeight
  }

  get width() {
    return this.rectangle.displayWidth
  }

  destroy() {
    this.rectangle.destroy()
    this.text.destroy()
  }

  setVisible(isVisible: boolean) {
    this.rectangle.setVisible(isVisible)
    this.text.setVisible(isVisible)
  }
}
