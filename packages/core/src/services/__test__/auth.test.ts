import { roleRepo, userRepo } from '@clean-auth/mem-db'
import { CONFIG } from '@clean-auth/utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Role, User } from '../../entities'
import { AuthSvc, jwtSign } from '../auth'

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function createUser(name: string, pass: string, token?: string, roles?: string[]) {
  const hash = await bcrypt.hash(pass, 10)
  const user = new User(name, hash)
  if (token) {
    user.token = token
  }

  if (roles && roles.length > 0) {
    user.roles = roles
  }

  await userRepo.create(user)
  return user
}

describe('test auth service', () => {
  const svc = new AuthSvc(userRepo, roleRepo)

  beforeEach(async () => {
    await createUser('test123', 'test_pass')
    const role = new Role('role1')
    await roleRepo.create(role)
  })

  afterEach(async () => {
    await userRepo.delete('test123')
    await roleRepo.delete('role1')
  })

  it('test auth success', async () => {
    const token = await svc.auth('test123', 'test_pass')
    expect(typeof token).toStrictEqual('string')
  })

  it('test auth fail', async () => {
    await expect(async () => {
      await svc.auth('test123', 'wrong_pass')
    }).rejects.toThrow('invalid user password')

    await expect(async () => {
      await svc.auth('wronguser', 'test_pass')
    }).rejects.toThrow('invalid user')
  })

  it('test auth invalid token success', async () => {
    const token = jwtSign('user1')
    await createUser('user1', 'pass', token)
    const resp = await svc.invalidate(token)
    expect(resp).toEqual(true)

    await expect(async () => {
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })
  })

  it('test auth invalid token fail', async () => {
    // wrong payload
    await expect(async () => {
      const token = jwt.sign({ bad: 'bad' }, CONFIG.JWT.SECRET, { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // wrong secret
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, 'weird_secret', { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // expired token
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, CONFIG.JWT.SECRET, { expiresIn: '10ms' })
      await delay(11)
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })
  })

  it('test auth check role success', async () => {
    const token = jwtSign('user1')
    console.log(CONFIG)
    await createUser('user1', 'pass', token, ['role1'])
    const resp1 = await svc.checkRole(token, 'role1')
    expect(resp1).toEqual(true)

    const resp2 = await svc.checkRole(token, 'norole')
    expect(resp2).toEqual(false)

    await userRepo.delete('user1')
  })

  it('test auth check role fail', async () => {
    // wrong payload
    await expect(async () => {
      const token = jwt.sign({ bad: 'bad' }, CONFIG.JWT.SECRET, { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // wrong secret
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, 'weird_secret', { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // expired token
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, CONFIG.JWT.SECRET, { expiresIn: '10ms' })
      await delay(11)
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })
  })

  it('test auth all roles success', async () => {
    const token = jwtSign('user1')
    await createUser('user1', 'pass', token, ['role1', 'role2', 'role3'])
    const resp = await svc.allRoles(token)
    expect(resp).toEqual(['role1', 'role2', 'role3'])

    await userRepo.delete('user1')
  })

  it('test auth all roles fail', async () => {
    // wrong payload
    await expect(async () => {
      const token = jwt.sign({ bad: 'bad' }, CONFIG.JWT.SECRET, { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // wrong secret
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, 'weird_secret', { expiresIn: CONFIG.JWT.EXPIRES_IN })
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })

    // expired token
    await expect(async () => {
      const token = jwt.sign({ username: 'user1' }, CONFIG.JWT.SECRET, { expiresIn: '10ms' })
      await delay(11)
      await createUser('user1', 'pass', token)
      await svc.invalidate(token)
    })
      .rejects.toThrow('invalid user token')
      .finally(async () => {
        await userRepo.delete('user1')
      })
  })
})
