

class User {
  constructor(uid, socket) {
    this.uid = uid
    this.socket = socket
    this._props = {}
  }

  can(permission) {
    //
  }

  prop(name) {
    return this._props[name]
  }

  get role() {
    return this.props.role_id
  }
}

export { User }
