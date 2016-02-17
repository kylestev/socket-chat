import escapeHtml from 'escape-html'
import { ChatFilter } from './ChatFilter'

/**
 * {@link ChatFilter} middleware that escapes malicious strings from reaching
 * browsers.
 */
class EscapeMessageFilter extends ChatFilter {
  /** @inheritdoc */
  handle(message, next) {
    message.body = escapeHtml(message.body.trim())
    next(message)
  }
}

export { EscapeMessageFilter }
