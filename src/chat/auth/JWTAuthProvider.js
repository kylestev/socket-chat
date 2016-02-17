import JWT from 'jsonwebtoken'
import { User } from '../User'

const debug = require('debug')('auth-jwt')

class JWTAuthProvider {
  constructor() {
    this._secret = process.env.JWT_SECRET
  }

  _createUser(decoded) {
    return new User(decoded.uid, decoded.username, {
      role: decoded.rank,
      email_hash: decoded.email_hash
    })
  }

  verifyUser(token) {
    return new Promise((resolve, reject) => {
      JWT.verify(token, this._secret, (err, decoded) => {
        if (err !== null) {
          debug('failed to decode JWT: ' + err)
          return reject(err)
        }

        let user = this._createUser(decoded)
        debug('decoded token for user ' + user.username)
        resolve(user)
      })
    })
  }
}

export { JWTAuthProvider }
