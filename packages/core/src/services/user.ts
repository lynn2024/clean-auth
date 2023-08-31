import bcrypt from 'bcrypt'
import { User } from '../entities'
import { IRoleRepo, IUserRepo } from '../repo'

export class UserSvc {
  userRepo: IUserRepo
  roleRepo: IRoleRepo

  constructor(userRepo: IUserRepo, roleRepo: IRoleRepo) {
    this.userRepo = userRepo
    this.roleRepo = roleRepo
  }

  async get(name: string) {
    const user = await this.userRepo.get(name)
    if (!user) {
      throw new Error('user not exist')
    }
    return user
  }

  async create(name: string, password: string) {
    if (!name) {
      throw new Error('username can not be empty')
    }
    if (!password) {
      throw new Error('password can not be empty')
    }

    const ifuser = await this.userRepo.get(name)
    if (ifuser) {
      throw new Error('username exist')
    }
    const hash = await bcrypt.hash(password, 10)
    const user = new User(name, hash)
    return await this.userRepo.create(user)
  }

  async delete(name: string) {
    const user = await this.userRepo.get(name)
    if (!user) {
      throw new Error('user not exist')
    }
    return await this.userRepo.delete(name)
  }

  async attach(username: string, rolename: string) {
    if (!username || !rolename) {
      throw new Error('username or rolename can not be empty')
    }
    const role = await this.roleRepo.get(rolename)
    if (!role) {
      throw new Error('rolename not exist')
    }
    return await this.userRepo.attach(username, rolename)
  }
}
