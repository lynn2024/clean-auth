import { Role } from '../entities'

export interface IRoleRepo {
  get(name: string): Promise<Role>
  create(role: Role): Promise<boolean>
  delete(name: string): Promise<boolean>
}
