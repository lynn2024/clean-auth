import { CONFIG } from '@clean-auth/utils'
import { SwaggerRouter } from 'koa-swagger-decorator'
import path from 'node:path'

const topRouter = new SwaggerRouter({ prefix: CONFIG.PREFIX })

// This is v1 routers
const v1 = new SwaggerRouter()
const v1Prefix = '/v1'
if (CONFIG.ENV === 'development') {
  v1.swagger({
    prefix: `${CONFIG.PREFIX}${v1Prefix}`,
    title: 'V1 API DOC',
    description: 'This is v1 api doc.',
    version: '1.0.0',
    swaggerHtmlEndpoint: '/doc.html',
    swaggerJsonEndpoint: '/json.html',
    swaggerOptions: {
      securityDefinitions: {
        api_key: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      }
    }
  })
}

// point to v1 apis directory
v1.mapDir(path.resolve(__dirname, `../api/v1/`))

// put v2 apis here in the future
// ...

topRouter.use(v1Prefix, v1.routes())
export default topRouter
