import { CONFIG, Logger } from '@clean-auth/utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IRoleRepo, IUserRepo } from '../repo'

export function jwtSign(username: string) {
  return jwt.sign({ username }, CONFIG.JWT.SECRET, { expiresIn: CONFIG.JWT.EXPIRES_IN })
}

export class AuthSvc {
  userRepo: IUserRepo
  roleRepo: IRoleRepo

  constructor(user: IUserRepo, role: IRoleRepo) {
    this.userRepo = user
    this.roleRepo = role
  }

  async auth(username: string, password: string) {
    const user = await this.userRepo.get(username)
    if (!user) {
      throw new Error('invalid user')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new Error('invalid user password')
    }
    const token = jwtSign(username)
    user.token = token
    await this.userRepo.update(user)
    return token
  }

  async invalidate(token: string) {
    const user = await this.getUserFromToken(token)
    user.token = ''
    await this.userRepo.update(user)
    return true
  }

  async checkRole(token: string, role: string) {
    const user = await this.getUserFromToken(token)
    return user.roles.indexOf(role) !== -1
  }

  async allRoles(token: string) {
    const user = await this.getUserFromToken(token)
    return user.roles
  }

  private async getUserFromToken(token: string) {
    let data
    try {
      data = jwt.verify(token, CONFIG.JWT.SECRET)
    } catch (e) {
      Logger.error(e)
      throw new Error('invalid user token')
    }

    if (typeof data === 'string') {
      throw new Error('invalid user token')
    }

    const user = await this.userRepo.get(data.username)
    if (!user) {
      throw new Error('invalid user token')
    }

    if (token !== user.token) {
      throw new Error('invalid user token')
    }
    return user
  }
}
