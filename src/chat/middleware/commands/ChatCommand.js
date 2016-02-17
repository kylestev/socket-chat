import { Middleware } from '../Middleware'
import { manager } from '../../permissions'

/**
 * A command that can be entered by a user and performs an encapsulated action.
 */
class ChatCommand {
  /**
   * @param  {ChatServer} server
   * @param  {String} action permission action name
   */
  constructor(server, action = '') {
    this._server = server
    this._action = action
  }

  /**
   * Checks to see if the sender can perform this command
   * @param  {User}  sender user executing the command
   * @return {Promise.<Boolean>}
   */
  isAllowed(sender) {
    if (! this._action) {
      return Promise.resolve(true)
    }

    return manager.can(this._action, sender)
  }

  /**
   * Handles the authorization for the user sending the command.
   * @param  {Message} message
   * @param  {Array.<String>} args
   * @return {Promise.<Message>}
   */
  handle(message, pieces) {
    return this.isAllowed(message.sender)
      .then(allowed => {
        if (! allowed) {
          throw new Error('You are not allowed to ' + this._action)
        }

        return this.process(message, pieces)
      })
  }

  /**
   * Processes the command message.
   * @param  {Message} message
   * @param  {Array.<String>} args
   * @return {Promise.<Message>}
   */
  process(message, args) {
    //
  }
}

export { ChatCommand }
