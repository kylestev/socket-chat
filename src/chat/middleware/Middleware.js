/**
 * Allows for interception and transformation of {@link Message}s as they go
 * through the message pipeline.
 */
class Middleware {
  /**
   * Handles a message being sent.
   * @param  {Message} message
   * @param  {Function} next
   */
  handle(message, next) {
    next(message)
  }
}

export { Middleware }
