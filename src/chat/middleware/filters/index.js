import { ChatFilter } from './ChatFilter'
import { EscapeMessageFilter } from './EscapeMessageFilter'
import { RateLimitFilter } from './RateLimitFilter'
import { SpamFilter } from './SpamFilter'

let attachMiddleware = (server) => {
  let config = server.config('server', 'spam')

  server.addMessageMiddleware(new EscapeMessageFilter())
  server.addMessageMiddleware(new RateLimitFilter(config.rateLimit))
  server.addMessageMiddleware(new SpamFilter(config.words))
}

export {
  attachMiddleware
}
