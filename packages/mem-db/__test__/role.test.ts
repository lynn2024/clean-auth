import { Role } from '@clean-auth/core'
import { roleRepo } from '../src'

describe('test role repo', () => {
  beforeAll(() => {
    const role = new Role('test123')
    roleRepo.create(role)
  })

  it('test role get exist', async () => {
    const r = await roleRepo.get('test123')
    expect(r.name).toEqual('test123')
  })

  it('test role get not exist', async () => {
    await expect(async () => {
      await roleRepo.get('no role')
    }).rejects.toThrow('no role role not found')
  })

  it('test role create success', async () => {
    const role = new Role('newrole')
    const resp = await roleRepo.create(role)
    expect(resp).toEqual(true)
  })

  it('test role create fail', async () => {
    await expect(async () => {
      const role = new Role('test123')
      await roleRepo.create(role)
    }).rejects.toThrow('role name exist')
  })

  it('test role delete', async () => {
    const resp = await roleRepo.delete("test123")
    expect(resp).toEqual(true)
  })
})
