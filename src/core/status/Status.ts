import { Monster } from '../Monster'

export enum StatusTypes {
  WET = 'WET',
  CHILLED = 'CHILLED',
  IGNITED = 'IGNITED',
  POISONED = 'POISONED',
  FROZEN = 'FROZEN',
  NONE = 'NONE',
}

export abstract class Status {
  protected monster: Monster
  constructor(monster: Monster) {
    this.monster = monster
  }

  public abstract reactToIncomingStatus(incomingStatus: Status): void
}
