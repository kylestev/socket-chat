import { Middleware } from '../Middleware'
import * as Permissions from '../../permissions'

class ChatFilter extends Middleware {
  constructor() {
    super()
    this._permissions = Permissions.manager
  }

  /**
   * Determines if the message can be sent
   * @param  {Message} message
   * @return {Promise.<Boolean>}
   */
  canSend(message) {
    throw new Error('not imeplemented')
  }

  /** @inheritdoc */
  handle(message, next) {
    return this.canSend(message)
      .then(() => next(message))
  }
}

export { ChatFilter }
