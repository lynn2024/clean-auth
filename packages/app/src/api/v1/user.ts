import type { Context } from 'koa'
import {
  body,
  description,
  path,
  prefix,
  request,
  summary,
  tags,
} from 'koa-swagger-decorator'
import { User, UserSvc, AuthSvc } from '@clean-auth/core'
import { userRepo } from '@clean-auth/mem-db'
import { Logger } from '@clean-auth/utils'
import { userSchema } from '../../schema/user'
import { roleRepo } from '@clean-auth/mem-db'

const tag = tags(['user'])

const userSvc = new UserSvc(userRepo, roleRepo)
const authSvc = new AuthSvc(userRepo, roleRepo)

export function userToResponseUser(user: User) {
  return {
    name: user.name
  }
}

@prefix('/user')
export default class UserController {

  @request('get', '/{name}')
  @summary('Get user')
  @description('example: /user/example_user')
  @tag
  @path({
    name: { type: 'string', required: true, default: null, description: 'username' },
  })
  async get(ctx: Context) {
    const { name } = ctx.validatedParams
    try {
      const user = await userSvc.get(name)
      ctx.body = userToResponseUser(user)
    } catch(e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20003)
    }
  }

  @request('post', '')
  @summary('create user')
  @description('example: /user')
  @tag
  @body(userSchema)
  async create(ctx: Context) {
    const userData = ctx.validatedBody
    try {
      await userSvc.create(userData.username, userData.password)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.parameterException(20004)
    }
    global.UnifyResponse.createSuccess({ code: global.SUCCESS_CODE })
  }

  @request('put', '')
  @summary('add role to user')
  @description('example: /user')
  @tag
  // @security([{ api_key: [] }])
  @body({
    user: { type: 'string', required: true, default: null, description: 'username' },
    role: { type: 'string', required: true, default: null, description: 'rolename' }
  })
  async attach(ctx: Context) {
    const userData = ctx.validatedBody
    try {
      await userSvc.attach(userData.user, userData.role)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20007)
    }
    global.UnifyResponse.updateSuccess({ code: global.SUCCESS_CODE })
  }

  @request('delete', '/{name}')
  @summary('Delete user')
  @description('example: /user/example_user')
  @tag
  @path({
    name: { type: 'string', required: true, default: null, description: 'username' },
  })
  async delete(ctx: Context) {
    const { name } = ctx.validatedParams
    try {
      await userSvc.delete(name)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20003)
    }
    global.UnifyResponse.deleteSuccess({ code: global.SUCCESS_CODE })

  }

  @request('post', '/auth')
  @summary('authenticate')
  @description('example: /auth')
  @tag
  @body(userSchema)
  async auth(ctx: Context) {
    const userData = ctx.validatedBody
    try {
      const token =  await authSvc.auth(userData.username, userData.password)
      ctx.body = {token:token, code:0}

    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.parameterException(20008)
    }
  }

  @request('get', '/invalid/{token}')
  @summary('invalidate')
  @description('example: /invalid')
  @tag
  @path({
    token: { type: 'string', required: true, default: null, description: 'token' },
  })
  async invalid(ctx: Context) {
    const { token } = ctx.validatedParams
    try {
      await authSvc.invalidate(token)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20009)
    }
    global.UnifyResponse.deleteSuccess({ code: global.SUCCESS_CODE })
  }

  @request('post', '/checkrole')
  @summary('check role')
  @description('example: /checkrole')
  @tag
  @body({
    token: { type: 'string', required: true, default: null, description: 'token' },
    role: { type: 'string', required: true, default: null, description: 'role' }
  })
  async checkRole(ctx: Context) {
    const userData = ctx.validatedBody
    try {
      ctx.body = await authSvc.checkRole(userData.token, userData.role)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20009)
    }
  }

  @request('get', '/allroles/{token}')
  @summary('allroles')
  @description('example: /allroles')
  @tag
  @path({
    token: { type: 'string', required: true, default: null, description: 'token' },
  })
  async allRoles(ctx: Context) {
    const { token } = ctx.validatedParams
    try {
      ctx.body = await authSvc.allRoles(token)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20009)
    }
  }
}
