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
import { Role, RoleSvc } from '@clean-auth/core'
import { roleRepo } from '@clean-auth/mem-db'
import { Logger } from '@clean-auth/utils'
import { roleSchema } from '../../schema/role'

const tag = tags(['role'])

const roleSvc = new RoleSvc(roleRepo)

export function roleToResponseRole(role: Role) {
  return {
    name: role.name
  }
}

@prefix('/role')
export default class RoleController {

  @request('get', '/{name}')
  @summary('Get role')
  @description('example: /role/example_role')
  @tag
  @path({
    name: { type: 'string', required: true, default: null, description: 'rolename' },
  })
  async get(ctx: Context) {
    const { name } = ctx.validatedParams
    try {
      const role = await roleSvc.get(name)
      ctx.body = roleToResponseRole(role)
    } catch(e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20005)
    }
  }

  @request('post', '')
  @summary('create role')
  @description('example: /role')
  @tag
  @body(roleSchema)
  async create(ctx: Context) {
    const roleData = ctx.validatedBody
    try {
      await roleSvc.create(roleData.rolename)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.parameterException(20006)
    }
    global.UnifyResponse.createSuccess({ code: global.SUCCESS_CODE })
  }

  @request('delete', '/{name}')
  @summary('Delete role')
  @description('example: /role/example_role')
  @tag
  @path({
    name: { type: 'string', required: true, default: null, description: 'rolename' },
  })
  async delete(ctx: Context) {
    const { name } = ctx.validatedParams
    try {
      await roleSvc.delete(name)
    } catch (e) {
      Logger.error(e)
      global.UnifyResponse.notFoundException(20005)
    }
    global.UnifyResponse.createSuccess({ code: global.SUCCESS_CODE })

  }
}
