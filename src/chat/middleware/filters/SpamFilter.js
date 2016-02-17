import { ChatFilter } from './ChatFilter'

/**
 * {@link ChatFilter} middleware that prevents black listed words being used
 * in messages.
 */
class SpamFilter extends ChatFilter {
  /**
   * @param  {Array.<String>} words array of words that should be blacklisted
   */
  constructor(words) {
    super()
    this._badWords = words.map(w => w.toLowerCase())
  }

  /**
   * Determines if the text contains a bad word.
   * @param  {string} text string to check for bad words
   * @return {boolean}
   */
  _containsBadWord(text) {
    const msg = text.toLowerCase()
    return this._badWords.some(word => msg.contains(word))
  }

  /** @inheritdoc */
  canSend(message) {
    if (this._permissions.can('evade spam filter', message.sender)) {
      return Promise.resolve(true)
    }

    return Promise.resolve(this._containsBadWord(message.body))
  }
}

export { SpamFilter }
