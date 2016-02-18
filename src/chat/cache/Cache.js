import url from 'url'
import redis from 'redis'
import * as _ from 'lodash'

/**
 * Parses any docker-compose linked services-styled environment variables
 * prefixed with {@code 'REDIS_'} and suffixed with {@code '_PORT'} to
 * allow for detection of services.
 * @return {Array.<Object>} array of objects containing the host and port
 */
const parseRedisEnvConnections = () => {
  return Object.keys(process.env)
    .filter(key => /^REDIS_\d+_PORT$/.test(key))
    .map(key => url.parse(process.env[key]))
    .map(uri => ({ port: uri.port, host: uri.hostname }))
}

/**
 * Attempts to find docker-compose styled environment variables - if more than
 * one docker-compose link is present, it will randomly select one.
 * @return {Object} object containing host and port key-value-pairs
 */
const chooseRedisConnection = () => {
  let available = parseRedisEnvConnections()
  if (available.length > 0) {
    return _.sample(available)
  }
  return { host: '127.0.0.1', port: 6379 }
}

class Cache {
  constructor({ client, keyPrefix }) {
    this._client = client
    this._prefix = keyPrefix || ''
  }

  itemKey(key) {
    return this._prefix + key
  }

  add(key, value, timeout = false) {
    return this.has(key)
      .then(exists => {
        if (! exists) {
          return this.set(key, value, timeout)
        }
        return true
      })
  }

  expire(key, seconds) {
    return new Promise((resolve, reject) => {
      this._client.expire(this.itemKey(key), seconds)
      resolve()
    })
  }

  forget(key) {
    return new Promise((resolve, reject) => {
      this._client.del(this.itemKey(key))
      resolve()
    })
  }

  get(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      this._client.get(this.itemKey(key), (err, reply) => {
        if (err) {
          return reject(err)
        }

        if (reply === null) {
          reply = defaultValue
        }

        resolve(reply)
      })
    })
  }

  has(key) {
    return this.get(key, false)
      .then(value => {
        return value !== false
      })
  }

  increment(key, seconds = null) {
    return new Promise((resolve, reject) => {
      this._client.incr(this.itemKey(key), (err, reply) => {
        if (err !== null) {
          return reject(err)
        }

        if (seconds) {
          return this.expire(key, seconds)
            .then(() => resolve(reply))
        }

        resolve(reply)
      })
    })
  }

  set(key, value, timeout = null) {
    return new Promise((resolve, reject) => {
      this._client.set(this.itemKey(key), value, (err, reply) => {
        if (err !== null) {
          return reject(err)
        }

        if (timeout) {
          return this.expire(key, timeout).then(resolve)
        }

        resolve()
      })
    })
  }

  static make(keyPrefix = '') {
    let client = redis.createClient(chooseRedisConnection())
    return new Cache({ client, keyPrefix })
  }
}

export { Cache }
