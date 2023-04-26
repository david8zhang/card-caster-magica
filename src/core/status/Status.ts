import Game from '~/scenes/Game'
import { Monster } from '../Monster'

export enum StatusTypes {
  WET = 'WET',
  CHILLED = 'CHILLED',
  IGNITED = 'IGNITED',
  POISONED = 'POISONED',
  FROZEN = 'FROZEN',
  NONE = 'NONE',
}

export interface StatusConfig {
  monster: Monster
  statusType: StatusTypes
  duration: number
  iconColor?: number
}

export abstract class Status {
  protected monster: Monster
  public statusType: StatusTypes
  public duration: number
  public iconColor: number | null = null
  protected expirationEvent!: Phaser.Time.TimerEvent

  constructor(config: StatusConfig) {
    this.monster = config.monster
    this.statusType = config.statusType
    this.duration = config.duration
    if (config.iconColor) {
      this.iconColor = config.iconColor
    }
  }

  public reactToIncomingStatus(incomingStatusType: StatusTypes) {
    this.monster.setCurrStatus(incomingStatusType)
  }
  public clear(): void {
    this.expirationEvent.paused = true
    this.expirationEvent.destroy()
    return
  }
  public start(): void {
    this.expirationEvent = Game.instance.time.delayedCall(this.duration - 50, () => {
      console.log('Expired event')
      this.monster.clearStatus()
    })
    return
  }
}
