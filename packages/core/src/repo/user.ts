import { User } from '../entities'

export interface IUserRepo {
  get(name: string): Promise<User | undefined>
  create(user: User): Promise<boolean>
  update(user: User): Promise<boolean>
  delete(name: string): Promise<boolean>
  attach(user: string, role: string): Promise<boolean>
}
