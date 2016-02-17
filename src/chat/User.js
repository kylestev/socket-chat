class User {
  constructor(uid, username, props = {}) {
    this._uid = uid
    this._username = username
    // this._socket = socket
    this._props = props
  }

  get emailHash() {
    return this._props.email_hash
  }

  get role() {
    return this._props.role
  }

  // get socket() {
  //   return this._socket
  // }

  get uid() {
    return this._uid
  }

  get username() {
    return this._username
  }
}

export { User }
