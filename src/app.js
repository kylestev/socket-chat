import Minimist from 'minimist'
import SocketServer from 'socket.io'

import { ChatServer } from './chat/ChatServer'
import { Config } from './chat/Config'

import * as middleware from './chat/middleware'

import { manager } from './chat/permissions/index'

/**
 * Creates a new socket.io/Server instance
 * @return {socket.io/Server} socket.io/Server instance
 */
let createSocketIO = () => {
  const sio = new SocketServer(8080)

  sio.on('connection', (socket) => {
    console.log('new conn', socket.id)
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

let parseCliAction = (args) => {
  return (args._ || ['run'])[0]
}

let user = {
  uid: 5,
  username: 'Bit',
  getRole() {
    return Promise.resolve('Admin')
  }
}

let args = parseArgs()
let chatServer = createChatServer(args)

switch (parseCliAction(args)) {
  case 'middleware:list':
    console.log(Object.keys(chatServer.middleware))
    process.exit()
  break
  case 'run':
    chatServer.listen(args.port || 8888)
    chatServer.handleMessage({
      sender: user,
      body: '/announce <script>alert("yeeee")</script>'
    })
  break
}

