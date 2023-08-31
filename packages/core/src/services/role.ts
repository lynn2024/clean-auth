import { Role } from '../entities'
import { IRoleRepo } from '../repo'

export class RoleSvc {
  repo: IRoleRepo

  constructor(repo: IRoleRepo) {
    this.repo = repo
  }

  async create(name: string) {
    if (!name) {
      throw new Error('role can not be empty')
    }
    const role = new Role(name)
    return await this.repo.create(role)
  }

  async get(name: string) {
    const role = await this.repo.get(name)
    if (!role) {
      throw new Error('role not exist')
    }
    return role
  }

  async delete(name: string) {
    const role = await this.repo.get(name)
    if (!role) {
      throw new Error('role not exist')
    }
    return await this.repo.delete(name)
  }
}
