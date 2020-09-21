# website-ssr-mobile

## Project setup
```
npm install
```

### SSR开发模式支持热加载，避免服务端调试重复Build
```
npm run dev:ssr
```

### SPA开发模式
```
npm run dev:spa
```

### 打包发布
```
npm run build:ssr

npm run start
```

### .env环境变量配置
在项目跟目录新建.env文件 参照.env.example修改环境变量配置

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 目录结构

```bash
├── README.md
├── babel.config.js
├── cypress.json
├── package-lock.json
├── package.json
├── public                                  // 静态资源
│   ├── favicon.ico
│   ├── img
│   │   └── icons
│   └── robots.txt
├── server
│   ├── app.js
│   └── setup-dev.js
├── src
│   ├── App.vue
│   ├── api                                 // api 请求相关
│   │   ├── create-api-client.js
│   │   ├── create-api-server.js
│   │   └── index.js
│   ├── assets                              // 图片、JS、语言包等资源
│   │   ├── images
│   │   ├── js
│   │   ├── lang
│   │   └── logo.png
│   ├── components                          // 组件目录
│   │   ├── base                            -- // 基础组件
│   │   ├── layout                          -- // 页面布局组件
│   │   ├── login                           -- // 登录组件
│   │   ├── product                         -- // 商品组件
│   │   └── siderBar                        -- // 侧边栏组件
│   ├── entry-client.js                     //
│   ├── entry-server.js                     //
│   ├── i18n.js                             //
│   ├── main.js                             //
│   ├── registerServiceWorker.js
│   ├── router                              // 网站路由
│   │   ├── account                         -- // 个人中心 相关路由
│   │   ├── activity                        -- // 活动页，版位 相关路由
│   │   ├── article                         -- // 网站文章类 相关路由
│   │   ├── checkout                        -- // checkout 相关路由
│   │   ├── helpCenter                      -- // 帮助中心 相关路由
│   │   ├── category                        -- // 分类页 相关路由
│   │   ├── product                         -- // 商详 相关路由
│   │   └── index.js                        -- // 路由主入口
│   ├── store                               // vuex 相关
│   │   ├── actions.js
│   │   ├── getters.js
│   │   ├── index.js
│   │   ├── modules
│   │   ├── mutation-types.js
│   │   ├── mutations.js
│   │   └── state.js
│   ├── styles                              // 样式 相关
│   │   ├── app.less
│   │   └── variables.less
│   ├── template                            // 模板 相关
│   │   └── index.template.html
│   ├── utils                               // 网站工具函数
│   │   ├── base.js
│   │   ├── cookie
│   │   ├── expend
│   │   ├── headManage
│   │   └── storage
│   └── views                               // 页面组件
│       ├── account                         -- // 个人中心 相关页面
│       ├── activity                        -- // 活动页，版位 相关页面
│       ├── article                         -- // 网站文章类 相关页面
│       ├── checkout                        -- // checkout 相关页面
│       ├── helpCenter                      -- // 帮助中心 相关页面
│       ├── category                        -- // 分类页 相关页面
│       └── product                         -- // 商详 相关页面
├── tests                                   // 前端测试相关
│   ├── e2e
│   │   ├── plugins
│   │   ├── specs
│   │   └── support
│   └── unit
│       └── example.spec.js
├── vue.config.client.js
├── vue.config.js
└── vue.config.server.js
```