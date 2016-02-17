import * as _ from 'lodash'
import * as roles from './roles'

/** @type {Array.<String>} roles that can classify admin users */
const ADMINS = [ roles.ADMIN ]

/** @type {Array.<String>} roles that classify staff users (admin + mod) */
const STAFF = [ roles.ADMIN, roles.CHAT_MOD ]

/** @type {Array.<String>} roles that classify banned users */
const NOT_BANNED = Object.values(roles).filter(role => role !== roles.BANNED)

/**
 * Registers actions and their allowed roles
 * @param  {PermissionManager} manager instance to register actions on
 */
let registerActions = (manager) => {
  // basic messaging
  manager.action('send messages', NOT_BANNED)

  // private messaging
  manager.action('send private messages', NOT_BANNED)
  manager.action('create private messages', STAFF)

  // chat message filters
  manager.action('evade spam filter', STAFF)
  manager.action('post messages containing links', STAFF)

  // message deletion
  manager.action('delete chat message', STAFF)
  manager.action('delete all chat messages', STAFF)

  // chat commands
  manager.action('see how to play', NOT_BANNED)
  manager.action('see how the raffle works', NOT_BANNED)

  // admin chat commands
  manager.action('embed images', ADMINS)
  manager.action('reset chat', ADMINS)
  manager.action('refresh a users browser', STAFF)
  manager.action('refresh all users browsers', ADMINS)
  manager.action('make announcements', ADMINS)
}

export {
  registerActions
}
