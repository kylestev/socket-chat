import * as filters from './filters'
import * as commands from './commands'

let attachMiddleware = (server) => {
  filters.attachMiddleware(server)
  commands.attachMiddleware(server)
}

export {
  attachMiddleware
}
