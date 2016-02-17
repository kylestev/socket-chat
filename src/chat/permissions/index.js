import { registerActions } from './actions'
import { PermissionManager } from './PermissionManager'
import * as roles from './roles'

let manager = new PermissionManager()

registerActions(manager)

export {
  manager,
  roles
}
