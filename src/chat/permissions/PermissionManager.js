/**
 * Manages permissions via actions and roles.
 */
class PermissionManager {
  constructor() {
    this.actions = {}
  }

  /**
   * Registers an action string with an array of roles that can perform the
   * action.
   * @param  {String} name statement representing the action
   * @param  {Array.<String>} roles array of role names
   */
  action(name, roles) {
    this.actions[name] = roles
  }

  /**
   * Determines if the passed user is allowed to perform the specified action.
   * @param  {String} action statement to check
   * @param  {User} user
   * @return {Promise.<boolean>} if the {@param user} can perform the
   * {@param action}
   */
  can(action, user) {
    let whitelistedRoles = this.actions[action]
    return user.getRole()
      .then(role => whitelistedRoles.includes(role))
  }
}

export { PermissionManager }
