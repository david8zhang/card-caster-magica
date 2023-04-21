import { Monster } from '../Monster'
import { Status } from './Status'

export class FrozenStatus extends Status {
  constructor(monster: Monster) {
    super(monster)
  }

  public reactToIncomingStatus(incomingStatus: Status): void {}
}
