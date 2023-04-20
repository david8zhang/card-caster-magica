import { WizardConfig } from '~/core/Wizard'

export enum Sides {
  PLAYER = 'Player',
  CPU = 'CPU',
}

export class Constants {
  public static MAP_WIDTH = 960
  public static MAP_HEIGHT = 480

  public static WINDOW_WIDTH = 960
  public static WINDOW_HEIGHT = 800

  public static SORT_LAYERS = {
    WIZARD: 80,
    SPELL: 90,
    UI: 100,
  }

  public static PLAYER_WIZARD_CONFIGS: WizardConfig[] = [
    {
      position: {
        x: 100,
        y: Constants.MAP_HEIGHT / 2 - 50,
      },
      texture: '',
      name: 'Wizard1',
    },
    {
      position: {
        x: 100,
        y: Constants.MAP_HEIGHT / 2 + 50,
      },
      texture: '',
      name: 'Wizard2',
    },
  ]
}
