import { JWTAuthProvider } from './JWTAuthProvider'

const createAuthProvider = () => {
  return new JWTAuthProvider()
}

const authProvider = createAuthProvider()

const verifyUser = (credentials) => {
  return authProvider.verifyUser(credentials)
}

export {
  verifyUser
}
