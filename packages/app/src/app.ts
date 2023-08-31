import Koa from 'koa'
import InitManager from './init'
import { CONFIG } from '@clean-auth/utils'

const app = new Koa()
const m = new InitManager(app)
m.initCore()

app.listen(CONFIG.PORT, () => {
  console.log(`Please open ${CONFIG.BASE_URL}:${CONFIG.PORT}${CONFIG.PREFIX}/v1/doc.html`)
})
export default app
