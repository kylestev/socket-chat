/**
 * A message sent by a user.
 */
class Message {
  /**
   * @param  {User} sender user sending the message
   * @param  {String} body message body
   */
  constructor(sender, body) {
    this.sender = sender
    this.body = body
    this.sent = false
    this.sentAt = Date.now()
  }
}

export { Message }
