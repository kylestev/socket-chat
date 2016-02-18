const redis = require('redis')

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
    let client = redis.createClient({ host: process.env.REDIS_HOST || '127.0.0.1' })
    return new Cache({ client, keyPrefix })
  }
}

export { Cache }
