import { Middleware } from '../Middleware'

/**
 * {@link Middleware} targeting the {@code message} pipeline which intercepts
 * messages prefixed with a {@code '/'} character and routes the command to the
 * proper handler.
 */
class ChatCommandHandler extends Middleware {
  constructor() {
    super()
    this._commands = {}
  }

  /**
   * Assigns {@link ChatCommand} to a given {@code '/'} command prefix
   * @param  {String} slashAction the word following the {@code '/'} at the
   * beginning of a chat command message.
   * @param  {ChatCommand} command
   */
  registerCommand(slashAction, command) {
    this._commands[slashAction] = command
  }

  _parseMessage(text) {
    let pieces = text.substring(1).split(' ')
    return {
      slashAction: pieces[0],
      rest: pieces.slice(1),
      pieces
    }
  }

  process(message) {
    let { slashAction, rest } = this._parseMessage(message.body)
    if (slashAction in this._commands) {
      return this._commands[slashAction]
        .handle(message, rest)
        .catch(e => { throw e })
    }
    return Promise.resolve(message)
  }

  /** @inheritdoc */
  handle(message, next) {
    if (message.body.startsWith('/')) {
      return this.process(message)
        .then(() => next(message))
    }

    return next(message)
  }
}

export { ChatCommandHandler }
