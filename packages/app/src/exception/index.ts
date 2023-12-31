import { Logger, isNumber } from '@clean-auth/utils'
import type Koa from 'koa'
import CODE from './exception-code'
import { HttpException, Success } from './http-exception'

const UNDEDINED_ERROR_TIP = 'undefined errorCode'

/**
 * Global exception catch
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function catchError(ctx: Koa.Context, next: any) {
  try {
    await next()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const isHttpException = error instanceof HttpException
    const request = `${ctx.method} ${ctx.path}`
    logError(error, isHttpException)

    if (isHttpException) {
      const message = getMessage(error)
      const code = getCode(error)
      ctx.status = error.status
      const data = {
        code,
        message,
        request
      }
      ctx.body = data
    } else if (error.status !== 500) {
      const data = {
        code: 10000,
        message: error.message || CODE.get(10000),
        request
      }
      ctx.body = data
      ctx.status = error.status || 500
    } else {
      const data = {
        code: 9999,
        message: CODE.get(9999),
        request
      }
      ctx.body = data
      ctx.status = error.status || 500
    }
  }
}

/**
 * logging
 * @param error error
 * @param isHttpException isHttpException
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logError(error: any, isHttpException: boolean) {
  const isSuccess = error instanceof Success
  if (isSuccess) return
  if (isHttpException) {
    const code = `ERROR_CODE: ${getCode(error)}`
    const message = getMessage(error)
    Logger.error('CUSTOM_EXCEPTION', code, message)
  } else {
    Logger.error('SERVER_ERROR', error, 'unknown mistake')
  }
}

/**
 * Get custom exception message
 * @param error
 * @returns message
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMessage(error: any): string {
  const message = isNumber(error.code) ? error.message || CODE.get(error.code) || UNDEDINED_ERROR_TIP : error.code
  return message
}

/**
 * Get custom error code
 * @param error
 * @returns code
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCode(error: any): number {
  const code = isNumber(error.code) ? error.code : 10000
  return code
}
