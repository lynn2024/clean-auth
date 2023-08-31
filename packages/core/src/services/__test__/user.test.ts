import { userRepo, roleRepo } from '@clean-auth/mem-db'
import { UserSvc } from '../user'
import { Role, User } from '../../entities'

describe('test user service', () => {
  const userSvc = new UserSvc(userRepo, roleRepo)

  beforeAll(async () => {
    const user = new User('test123', 'test_pass')
    await userRepo.create(user)
    const role = new Role('role1')
    await roleRepo.create(role)
  })

  it('test user get exist', async () => {
    const u = await userSvc.get('test123')
    expect(u.name).toEqual('test123')
    expect(u.password).toEqual('test_pass')
  })

  it('test user get no exist', async () => {
    await expect(async () => {
      await userSvc.get("nouser")
    }).rejects.toThrow('user not exist')
  })

  it('test user create success', async () => {
    const resp = await userSvc.create('newuser', 'newpass')
    expect(resp).toEqual(true)
  })

  it('test user create fail', async () => {
    await expect(async () => {
      await userSvc.create('', 'newpass')
    }).rejects.toThrow('username can not be empty')

    await expect(async () => {
      await userSvc.create('test123', '')
    }).rejects.toThrow('password can not be empty')

    await expect(async () => {
      await userSvc.create('test123', 'newpass')
    }).rejects.toThrow('username exist')
  })

  it('test user attach success', async () => {
    const resp = await userSvc.attach('test123', 'role1')
    expect(resp).toEqual(true)
  })

  it('test user attach fail', async () => {
    await expect(async () => {
      await userSvc.attach('', 'role1')
    }).rejects.toThrow('username or rolename can not be empty')

    await expect(async () => {
      await userSvc.attach('test123', '')
    }).rejects.toThrow('username or rolename can not be empty')

    await expect(async () => {
      await userSvc.attach('test123', 'norole')
    }).rejects.toThrow('norole role not found')
  })

  it('test user delete fail', async () => {
    await expect(async () => {
      await userSvc.delete("nouser")
    }).rejects.toThrow('user not exist')
  })

  it('test user delete success', async () => {
    const resp = await userSvc.delete('test123')
    expect(resp).toEqual(true)
  })
})
