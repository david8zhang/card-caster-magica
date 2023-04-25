export const createSpellAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'poison-gas-anim',
    frames: anims.generateFrameNames('poison-gas-anim', {
      start: 0,
      end: 4,
      suffix: '.png',
    }),
    frameRate: 10,
  })

  anims.create({
    key: 'fireball-anim',
    frames: anims.generateFrameNames('fireball-anim', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    frameRate: 12,
    repeat: -1,
  })

  anims.create({
    key: 'heal-anim',
    frames: anims.generateFrameNames('heal-anim', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    frameRate: 8,
    repeat: -1,
  })

  anims.create({
    key: 'rock-explosion-anim',
    frames: anims.generateFrameNames('rock-explosion-anim', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
  })

  anims.create({
    key: 'frozen-shatter',
    frames: anims.generateFrameNames('frozen-shatter', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
  })

  anims.create({
    key: 'water-blast-anim',
    frames: anims.generateFrameNames('water-blast-anim', {
      frames: [0, 1, 2, 3, 4, 3, 4, 3, 4, 3, 4, 5, 6, 7, 8],
      suffix: '.png',
    }),
    frameRate: 10,
  })

  anims.create({
    key: 'frost-wind-anim',
    frames: anims.generateFrameNames('frost-wind-anim', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: 2,
    frameRate: 10,
  })

  anims.create({
    key: 'explosion',
    frames: anims.generateFrameNames('explosion', {
      start: 0,
      end: 7,
      suffix: '.png',
    }),
    frameRate: 12,
  })
}
