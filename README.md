# clean-auth


这个项目是一个Node.js TypeScript的单体库（monorepo）文件夹结构。

`packages/core` 是业务核心逻辑包，采用了整洁架构设计。这个包通常包含主要的业务逻辑、领域模型、用例和接口等内容。

`packages/mem-db` 是一个简单的内存数据库，用于在内存中存储和检索数据。

`packages/app` 包含应用逻辑，处理HTTP请求，并提供一些实用工具，其中用koa提供HTTP server,用SwaggerAPI文档生成并提供dev环境手动测试网页。

`packages/utils` 包含一些辅助函数和工具，例如日志记录器（logger）和配置（config）等。
 

<!-- [API文档](./doc.html) -->
<a href="./doc.pdf" download>API文档</a>
## 开始运行

安装 要求本地node>16并安装pnpm

run `pnpm install`

run `pnpm run dev` for dev

run `pnpm run test` for unit test


## 项目目录介绍

### 1.1 `packages/app`

packages/app/src/app app入口

packages/app/src/api/v1 根目录：利用swagger处理restful api接口逻辑

packages/app/src/api/v1/role 角色信息处理API：主要依赖`core/service/role`处理业务逻辑

packages/app/src/api/v1/user 用户信息处理API：主要依赖`core/service/user` `core/service/auth`处理业务逻辑

packages/app/src/api/v1/exception 错误信息处理：包括错误的返回处理、错误码配置、错误信息配置


### 1.2 `packages/core`

packages/core/src/entities 核心数据结构 包括用户信息、角色信息

packages/core/src/repo 数据接口，通过提供接口使得core和mem-db完成依赖反转，core拥有接口，mem-db实现接口

packages/core/src/services/user 用户信息逻辑处理部分:包括用户的创建、删除、绑定用户角色

packages/core/src/services/role 角色逻辑处理部分:包括角色的创建、删除

packages/core/src/services/auth 验证用户逻辑处理部分:验证用户信息发令牌、失效令牌、校验用户角色、获取用户角色

packages/core/src/services/__test__ services相关单元测试


### 1.3 `packages/mem-db`

packages/mem-db/src/roleRepo 角色相关数据内存存储处理

packages/mem-db/src/userRepo 用户相关数据内存存储处理

packages/mem-db/__test__  mock数据库相关单元测试


### 1.4 `packages/utils`

packages/utils/src/config 环境配置

packages/utils/src/log 开发环境测试日志


## 使用的库

- eslint
- jest
- jsonwebtoken
- koa
- bcrypt
- koa-body
- koa-swagger-decorator