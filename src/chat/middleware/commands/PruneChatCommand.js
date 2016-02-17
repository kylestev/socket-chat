import { ChatCommand } from './ChatCommand'

/**
 * Prunes the chat buffer for all users.
 */
class PruneChatCommand extends ChatCommand {
  /**
   * @param  {ChatServer} server
   */
  constructor(server) {
    super(server, 'delete all chat messages')
  }

  /** @inheritdoc */
  process(message, args) {
    console.log('pruning chat messages!')
    return Promise.resolve(message)
  }
}

export { PruneChatCommand }
