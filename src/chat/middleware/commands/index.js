import * as _ from 'lodash'

import { ChatCommandHandler } from './ChatCommandHandler'
import { PruneChatCommand } from './PruneChatCommand'

let createCommandHandler = (server) => {
  let commandHandler = new ChatCommandHandler()

  let commands = {
    'prune': new PruneChatCommand(server),
  }

  _.each(commands, (command, slashAction) => {
    commandHandler.registerCommand(slashAction, command)
  })

  return commandHandler
}

let attachMiddleware = (server) => {
  server.addMessageMiddleware(
    createCommandHandler(server)
  )
}

export {
  attachMiddleware
}
