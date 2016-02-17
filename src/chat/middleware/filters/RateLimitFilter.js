import { ChatFilter } from './ChatFilter'
import { RateLimiter } from '../../cache/RateLimiter'
import { RateLimitExceededError } from '../../errors'

/**
 * {@link ChatFilter} middleware for rate limiting the number of messages
 * a {@link User} can send in short periods of time.
 */
class RateLimitFilter extends ChatFilter {
  /**
   * @param  {int} options.decay TTL in seconds for each hit on the rate
   * limiter
   * @param  {int} options.maxMessageBurst number of messages that can be sent
   * before this filter kicks in
   * @param  {String} options.cacheKeyPrefix cache key prefix value
   */
  constructor({ decay, maxMessageBurst, cacheKeyPrefix }) {
    super()
    this._decaySeconds = decay
    this._maxBurst = maxMessageBurst
    this._limiter = new RateLimiter(cacheKeyPrefix)
  }

  /**
   * Checks the cache {@link RateLimiter} to see if the user can send a message
   *
   * @param  {User} sender the message sender
   * @return {Promise.<boolean>} a Promise which resolves if the user has
   * exceeded their burst message limit
   */
  _checkBurstLimit(sender) {
    return this._limiter
      .exceedsLimit(sender.uid, this._maxBurst, this._decaySeconds)
      .catch(RateLimitExceededError, (err) => {
        throw new Error('You are only allowed to send a maximum of ' +
          this._maxBurst + ' messages every ' + this._decaySeconds + ' seconds.')
      })
  }

  /** @inheritdoc */
  canSend(message) {
    if (this._permissions.can('evade spam filter', message.sender)) {
      return Promise.resolve(true)
    }

    return this._checkBurstLimit(message.sender)
  }
}

export { RateLimitFilter }
