import { UnifyResponse } from './exception/unify-response'

class InitGlobal {
  init() {
    global.UnifyResponse = new UnifyResponse()
    global.SUCCESS_CODE = 0
  }
}

export default new InitGlobal()
