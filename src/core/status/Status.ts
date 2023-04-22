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
}

export abstract class Status {
  protected monster: Monster
  public statusType: StatusTypes
  public duration: number
  protected expirationEvent!: Phaser.Time.TimerEvent

  constructor(config: StatusConfig) {
    this.monster = config.monster
    this.statusType = config.statusType
    this.duration = config.duration
  }

  public reactToIncomingStatus(incomingStatus: Status) {
    this.monster.setCurrStatus(incomingStatus.statusType)
  }
  public clear(): void {
    this.expirationEvent.paused = true
    this.expirationEvent.destroy()
    return
  }
  public start(): void {
    this.expirationEvent = Game.instance.time.delayedCall(this.duration, () => {
      this.monster.clearStatus()
    })
    return
  }
}
