import { IRoleRepo, Role } from '@clean-auth/core'

class RoleRepo implements IRoleRepo {
  roles: Map<string, Role> = new Map()

  async get(name: string) {
    const role = this.roles.get(name)
    if (!role) {
      throw new Error(name + ' role not found')
    }
    return role
  }

  async create(role: Role) {
    if (this.roles.has(role.name)) {
      throw new Error('role name exist')
    }
    this.roles.set(role.name, role)
    return true
  }

  async delete(name: string) {
    this.roles.delete(name)
    return true
  }
}

export const roleRepo = new RoleRepo()
