import { Config } from '../Config'
import { JWTAuthProvider } from './JWTAuthProvider'

const createAuthProvider = (config) => {
  return new JWTAuthProvider(config)
}

const authConfig = new Config(__dirname + '/../../../config/auth.json')
const authProvider = createAuthProvider(authConfig)

const verifyUser = (credentials) => {
  return authProvider.verifyUser(credentials)
}

export {
  verifyUser
}
