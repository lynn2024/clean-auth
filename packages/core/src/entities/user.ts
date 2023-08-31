export class User {
  readonly name: string
  readonly password: string
  token: string
  roles: string[] // role name

  constructor(name: string, password: string) {
    this.name = name
    this.password = password
    this.token = ''
    this.roles = []
  }

  setToken(token: string) {
    this.token = token
  }

  expireToken() {
    this.token = ''
  }
}
