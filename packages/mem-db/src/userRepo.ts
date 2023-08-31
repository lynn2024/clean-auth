import {IUserRepo, User } from "@clean-auth/core"

class UserRepo implements IUserRepo {
  users: Map<string, User> = new Map()

  async get(name: string) {
    const user = this.users.get(name)
    return user
  }

  async create(user: User) {
    if (this.users.has(user.name)) {
      throw new Error("username exist")
    }
    this.users.set(user.name, user)
    return true
  }

  async update(user: User) {
    if (!this.users.has(user.name)) {
      throw new Error("user not exist")
    }
    this.users.set(user.name, user)
    return true
  }

  async delete(name: string) {
    this.users.delete(name)
    return true
  }

  async attach(username: string, rolename: string) {
    const user = this.users.get(username)
    if (!user) {
      throw new Error("user not exist")
    }

    if(user.roles.indexOf(rolename) === -1) {
      user.roles.push(rolename)
      await this.update(user)
    }
    return true
  }

}

export const userRepo = new UserRepo()
