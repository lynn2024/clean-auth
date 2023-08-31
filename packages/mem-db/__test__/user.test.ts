import { User } from '@clean-auth/core'
import { userRepo } from '../src'

describe('test user repo', () => {
  beforeAll(() => {
    const user = new User('test123', 'test_pass')
    userRepo.create(user)
  })

  it('test user get exist', async () => {
    const u = await userRepo.get('test123')
    expect(u?.name).toEqual('test123')
    expect(u?.password).toEqual('test_pass')
  })

  it('test user get no exist', async () => {
    const u = await userRepo.get('nouser')
    expect(u).toEqual(undefined)
  })

  it('test user create success', async () => {
    const user = new User('newuser', 'newpass')
    const resp = await userRepo.create(user)
    expect(resp).toEqual(true)
  })

  it('test user create fail', async () => {
    await expect(async () => {
      const user = new User('test123', 'newpass')
      await userRepo.create(user)
    }).rejects.toThrow('username exist')
  })

  it('test user update success', async () => {
    const user = new User('test123', 'anotherpass')
    const resp = await userRepo.update(user)
    expect(resp).toEqual(true)

    const u = await userRepo.get('test123')
    expect(u?.password).toEqual('anotherpass')
  })

  it('test user update fail', async () => {
    await expect(async () => {
      const user = new User('nouser', 'anotherpass')
      await userRepo.update(user)
    }).rejects.toThrow('user not exist')
  })

  it('test user attach role name success', async () => {
    const resp = await userRepo.attach('test123', 'role1')
    expect(resp).toEqual(true)

    const u = await userRepo.get('test123')
    expect(u?.roles).toStrictEqual(['role1'])
  })

  it('test user attach role name fail', async () => {
    await expect(async () => {
      await userRepo.attach('nouser', 'role1')
    }).rejects.toThrow('user not exist')
  })

  it('test user delete', async () => {
    const resp = await userRepo.delete("test123")
    expect(resp).toEqual(true)
  })
})
