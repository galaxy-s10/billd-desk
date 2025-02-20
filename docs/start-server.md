## billd-desk-server(pro)

## 安装依赖

> 使用 node 版本：v18.19.0，建议18版本
> 使用 pnpm 版本：9.1.3，建议9版本

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-html-webpack-plugin@latest
```

## 运行

> 1. 项目使用到了 mysql 和 redis，他们都是用 docker 来启动的。
> 2. 项目启动后，会在项目的 src/secret/目录下生成 secret-beta、secret-dev、secret-prod 文件，请填写里面的信息，MYSQL_CONFIG、REDIS_CONFIG 必填！
> 3. 配置文件：**`src/spec-config.ts`**，请填写里面的信息。

1. 初始化 docker 容器

如果你用 docker 启动 mysql 和 redis，就需要初始化 docker 容器。

如果你不用 docker，你本地 mysql 和 redis，只要你连上 mysql 和 redis 即可，不需要初始化 docker 容器。

```bash
npm run docker:dev
```

执行效果：

```bash
➜  billd-desk-server-pro git:(main) ✗ npm run docker:dev

> billd-desk-server@0.1.0 docker:dev
> cross-env NODE_ENV=development NODE_APP_RELEASE_PROJECT_ALIAS=src NODE_APP_RELEASE_PROJECT_NAME=billd-desk-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=5300 nodemon --exec node -r @swc-node/register ./src/init/docker.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/init/docker.ts`
[2025/2/17 21:06:33] SUCCESS  添加路径别名成功！
[2025/2/17 21:06:33] SUCCESS  docker已安装
[2025/2/17 21:06:33]  WARN    开始启动Mysql
[2025/2/17 21:06:36] SUCCESS  启动Mysql成功！ ✅
[2025/2/17 21:06:36]  WARN    开始启动Redis
[2025/2/17 21:06:37] SUCCESS  启动Redis成功！ ✅
[nodemon] clean exit - waiting for changes before restart

```

> 看到 `[nodemon] clean exit - waiting for changes before restart`后，就 ctrl+c 退出命令即可。

2. 初始化数据库

这个命令只需要执行一次，执行后就会自动创建数据库（src/secret/secret-dev 的 MYSQL_CONFIG.database）和数据库表。

执行一次后，以后都不需要执行了。

```bash
npm run mysql:dev
```

执行效果：

```bash
➜  billd-desk-server-pro git:(main) ✗ npm run mysql:dev

> billd-desk-server@0.1.0 mysql:dev
> cross-env NODE_APP_INIT_MYSQL=true NODE_ENV=development NODE_APP_RELEASE_PROJECT_NAME=billd-desk-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=5300 nodemon --exec node -r @swc-node/register ./src/index.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/index.ts`
[2025/2/17 21:21:47] SUCCESS  添加路径别名成功！
[2025/2/17 21:21:48]  INFO    开始连接127.0.0.1:3307服务器的billd_desk_test数据库...
[2025/2/17 21:21:48] SUCCESS  新建billd_desk_test数据库成功！
[2025/2/17 21:21:48]  WARN    开始校正数据库所有表
[2025/2/17 21:21:48] SUCCESS  校正数据库所有表完成！
[2025/2/17 21:21:48]  INFO    加载数据库表: auth
[2025/2/17 21:21:48]  INFO    加载数据库表: desk_config
[2025/2/17 21:21:48]  INFO    加载数据库表: desk_user
[2025/2/17 21:21:48]  INFO    加载数据库表: desk_version
[2025/2/17 21:21:48]  INFO    加载数据库表: live
[2025/2/17 21:21:48]  INFO    加载数据库表: mock_day_data
[2025/2/17 21:21:48]  INFO    加载数据库表: mock_hour_data
[2025/2/17 21:21:48]  INFO    加载数据库表: mock_minute_ten_data
[2025/2/17 21:21:48]  INFO    加载数据库表: mock_minute_thirty_data
[2025/2/17 21:21:48]  INFO    加载数据库表: qq_user
[2025/2/17 21:21:48]  INFO    加载数据库表: role
[2025/2/17 21:21:48]  INFO    加载数据库表: role_auth
[2025/2/17 21:21:48]  INFO    加载数据库表: third_user
[2025/2/17 21:21:48]  INFO    加载数据库表: user
[2025/2/17 21:21:48]  INFO    加载数据库表: user_role
[2025/2/17 21:21:48]  INFO    加载数据库表: wechat_user
[2025/2/17 21:21:48] SUCCESS  加载所有数据库表成功!
[2025/2/17 21:21:48]  WARN    开始初始化数据库所有表
[2025/2/17 21:21:48]  WARN    需要删除外键的表:
[2025/2/17 21:21:48] SUCCESS  删除表的外键成功！
[2025/2/17 21:21:48]  WARN    需要删除索引的表:
[2025/2/17 21:21:48] SUCCESS  删除表的索引成功！
[2025/2/17 21:21:48] SUCCESS  删除所有表成功！
[2025/2/17 21:21:48] SUCCESS  初始化数据库所有表完成！
[2025/2/17 21:21:48] SUCCESS  初始化数据库数据完成！请退出该命令！

```

> 看到 `初始化数据库数据完成！请退出该命令！`后，就 ctrl+c 退出命令即可。

3. 运行，默认运行在 5300 端口

```bash
npm run dev
```

执行效果：

```bash
➜  billd-desk-server-pro git:(main) ✗ npm run dev

> billd-desk-server@0.1.0 dev
> cross-env NODE_ENV=development NODE_APP_RELEASE_PROJECT_NAME=billd-desk-server NODE_APP_RELEASE_PROJECT_ENV=dev NODE_APP_RELEASE_PROJECT_PORT=5300 nodemon --exec node -r @swc-node/register ./src/index.ts

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `node -r @swc-node/register ./src/index.ts`
[2025/2/17 21:27:17] SUCCESS  添加路径别名成功！
[2025/2/17 21:27:17]  INFO    开始连接127.0.0.1:3307服务器的billd_desk_test数据库...
[2025/2/17 21:27:17]  INFO    开始连接127.0.0.1:6380服务器的redis数据库...
[2025/2/17 21:27:17]  INFO    开始连接127.0.0.1:6380服务器的redis Pub...
[2025/2/17 21:27:17]  INFO    开始连接127.0.0.1:6380服务器的redis Sub...
[2025/2/17 21:27:17] SUCCESS  连接127.0.0.1:6380服务器的redis数据库成功!
[2025/2/17 21:27:17] SUCCESS  连接127.0.0.1:6380服务器的redis Sub 成功!
[2025/2/17 21:27:17] SUCCESS  连接127.0.0.1:6380服务器的redis Pub 成功!
[2025/2/17 21:27:17]  INFO    加载数据库表: auth
[2025/2/17 21:27:17]  INFO    加载数据库表: desk_config
[2025/2/17 21:27:17]  INFO    加载数据库表: desk_user
[2025/2/17 21:27:17]  INFO    加载数据库表: desk_version
[2025/2/17 21:27:17]  INFO    加载数据库表: live
[2025/2/17 21:27:17]  INFO    加载数据库表: mock_day_data
[2025/2/17 21:27:17]  INFO    加载数据库表: mock_hour_data
[2025/2/17 21:27:17]  INFO    加载数据库表: mock_minute_ten_data
[2025/2/17 21:27:17]  INFO    加载数据库表: mock_minute_thirty_data
[2025/2/17 21:27:17]  INFO    加载数据库表: qq_user
[2025/2/17 21:27:17]  INFO    加载数据库表: role
[2025/2/17 21:27:17]  INFO    加载数据库表: role_auth
[2025/2/17 21:27:17]  INFO    加载数据库表: third_user
[2025/2/17 21:27:17]  INFO    加载数据库表: user
[2025/2/17 21:27:17]  INFO    加载数据库表: user_role
[2025/2/17 21:27:17]  INFO    加载数据库表: wechat_user
[2025/2/17 21:27:17] SUCCESS  加载所有数据库表成功!
[2025/2/17 21:27:17] SUCCESS  连接127.0.0.1:3307服务器的billd_desk_test数据库成功!
[2025/2/17 21:27:17]  INFO    加载路由: auth.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: deskUser.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: deskVersion.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: init.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: qqUser.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: role.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: user.router.ts
[2025/2/17 21:27:17]  INFO    加载路由: wechatUser.router.ts
[2025/2/17 21:27:17] SUCCESS  加载所有路由成功！
[2025/2/17 21:27:17] SUCCESS  初始化websocket成功！

[2025/2/17 21:27:17]  WARN    监听端口: 5300
[2025/2/17 21:27:17]  WARN    项目名称: billd-desk-server
[2025/2/17 21:27:17]  WARN    项目环境: dev
[2025/2/17 21:27:17]  WARN    mysql host: 127.0.0.1
[2025/2/17 21:27:17]  WARN    mysql数据库: billd_desk_test
[2025/2/17 21:27:17] SUCCESS  http://127.0.0.1:5300/
[2025/2/17 21:27:17] SUCCESS  http://192.168.1.102:5300/
[2025/2/17 21:27:17] SUCCESS  http://10.211.55.2:5300/
[2025/2/17 21:27:17] SUCCESS  http://10.37.129.2:5300/
[2025/2/17 21:27:17] SUCCESS  项目启动成功！耗时：233ms

[2025/2/17 21:27:17]  INFO    联系作者:    https://desk.hsslive.cn/#/hi
[2025/2/17 21:27:17]  INFO    订阅仓库:    https://desk.hsslive.cn/#/price
[2025/2/17 21:27:17]  INFO    私有化部署:   https://desk.hsslive.cn/#/privatizationDeployment
[2025/2/17 21:27:17]  INFO    欢迎PR:      billd-desk目前只有作者一人开发，难免有不足的地方，欢迎提PR或Issue


```
