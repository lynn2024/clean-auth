import { roleRepo } from '@clean-auth/mem-db'
import { RoleSvc } from '../role'
import { Role } from '../../entities'

describe('test role service', () => {
  const roleSvc = new RoleSvc(roleRepo)

  beforeAll(async () => {
    const role = new Role('role1')
    await roleRepo.create(role)
  })

  it('test role get exist', async () => {
    const role = await roleSvc.get('role1')
    expect(role.name).toEqual('role1')
  })

  it('test role get no exist', async () => {
    await expect(async () => {
      await roleSvc.get("norole")
    }).rejects.toThrow('norole role not found')
  })

  it('test role create success', async () => {
    const resp = await roleSvc.create('newrole')
    expect(resp).toEqual(true)
  })

  it('test role create fail', async () => {
    await expect(async () => {
      await roleSvc.create('')
    }).rejects.toThrow('role can not be empty')
  })

  it('test role delete success', async () => {
    const resp = await roleRepo.delete('role1')
    expect(resp).toEqual(true)
  })
})
