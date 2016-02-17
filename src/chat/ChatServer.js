import * as _ from 'lodash'
import { Config } from './Config'

const debugMiddleware = require('debug')('middleware')

/**
 * Chat Server
 */
class ChatServer {
  /**
   * @param  {socket.io/Server} sio socket.io Server instance
   */
  constructor(sio) {
    this._sio = sio
    this._config = {}
    this._messageMiddleware = []
  }

  listen(port) {
    this._sio.listen(port)
  }

  get middleware() {
    let obj = {}
    this._messageMiddleware.forEach(middleware => obj[middleware.constructor.name] = middleware)
    return obj
  }

  /**
   * Adds {@link Middleware} to the message middleware pipeline.
   * @param {Middleware} middleware [description]
   */
  addMessageMiddleware(middleware) {
    this._messageMiddleware.push(middleware)
  }

  /**
   * Pass a {@link Message} through its middleware pipeline.
   * @param  {Message} message
   */
  handleMessage(message) {
    try {
      this._messageMiddleware.forEach(middleware => {
        debugMiddleware('running: ' + middleware.constructor.name)
        middleware.handle(message, (msg) => debugMiddleware('next called: ' + msg))
      })
    } catch (e) {
      debugMiddleware('error: ' + e.message)
      return false
    }
    return true
  }

  /**
   * Fetch the specified config.
   * @param  {String} name name of the loaded config
   * @param  {String} path [description]
   * @return {null|mixed}
   */
  config(name, path = '') {
    return this._config[name].get(path)
  }

  /**
   * Loads config from a file.
   * @param  {String} name key used to retrieve config
   * @param  {String} path path to config file
   */
  loadConfig(name, path) {
    this._config[name] = new Config(path)
  }
}

export { ChatServer }
