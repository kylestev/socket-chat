import Minimist from 'minimist'
import SocketServer from 'socket.io'

import { ChatServer } from './chat/ChatServer'
import * as middleware from './chat/middleware'

const debug = require('debug')('server')

/**
 * Creates a new socket.io/Server instance
 * @return {socket.io/Server} socket.io/Server instance
 */
let createSocketIO = () => {
  const sio = new SocketServer(8080)

  sio.on('connection', (socket) => {
    debug('new conn: ' + socket.id)
  })

  return sio
}

/**
 * Runs bootstrapping code on a {@link ChatServer} instance.
 * @param  {ChatServer} server {@link ChatServer} instance to bootstrap
 * @return {ChatServer} original instance after bootstrap methods have been applied
 */
let bootstrapChatServer = (args, server) => {
  const CONFIG_DIR = args['config-dir'] || (__dirname + '/../config/')
  let configPath = (path) => CONFIG_DIR + path

  // load config
  server.loadConfig('server', configPath('server.json'))

  // load middlewares
  middleware.attachMiddleware(server)

  return server
}

let parseArgs = () => {
  return Minimist(process.argv.slice(2))
}

/**
 * Creates a new ChatServer instance
 * @return {ChatServer}
 */
let createChatServer = (args) => {
  let sio = createSocketIO()
  let server = new ChatServer(sio)

  bootstrapChatServer(args, server)

  return server
}

/**
 * Gets the action (first argument) passed in via the CLI
 * @param  {Minimist} args
 * @return {String} first argument or {@code 'run'} if no action is present
 */
let parseCliAction = (args) => {
  return args._[0] || 'run'
}

let args = parseArgs()
let chatServer = createChatServer(args)

switch (parseCliAction(args)) {
  case 'middleware:list':
    console.log(Object.keys(chatServer.middleware))
    process.exit()
    break
  case 'run':
    const port = args.port || 8888
    chatServer.listen(port)
    debug('listening on port: ' + port)
    break
}

