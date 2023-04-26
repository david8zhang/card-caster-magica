import { Monster } from '../Monster'
import { ChilledStatus } from './ChilledStatus'
import { FrozenStatus } from './FrozenStatus'
import { IgnitedStatus } from './IgnitedStatus'
import { NoneStatus } from './NoneStatus'
import { PoisonedStatus } from './PoisonedStatus'
import { Status, StatusTypes } from './Status'
import { WetStatus } from './WetStatus'

export class StatusFactory {
  private monster: Monster
  public static statusMappingClasses: {
    [key in StatusTypes]: Status
  }

  constructor(monster: Monster) {
    this.monster = monster

    StatusFactory.statusMappingClasses = {
      [StatusTypes.WET]: new WetStatus(this.monster),
      [StatusTypes.NONE]: new NoneStatus(this.monster),
      [StatusTypes.CHILLED]: new ChilledStatus(this.monster),
      [StatusTypes.FROZEN]: new FrozenStatus(this.monster),
      [StatusTypes.IGNITED]: new IgnitedStatus(this.monster),
      [StatusTypes.POISONED]: new PoisonedStatus(this.monster),
    }
  }
}
