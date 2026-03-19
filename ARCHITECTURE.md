# RyuuPlay 项目架构梳理

本文档基于当前仓库代码（npm workspaces 单仓）梳理整体架构、各 package 职责及它们之间的关系。

## 1. 项目整体结构

仓库采用 npm workspaces 管理，根目录 `package.json` 声明了 5 个 workspace：

- `packages/common`
- `packages/sets`
- `packages/server`
- `packages/play`
- `packages/cordova`

另外，根目录还有两个关键启动配置文件：

- `start.js`：系统启动入口（加载配置、初始化卡牌、连接数据库、启动 HTTP + WebSocket）
- `init.js`：环境初始化脚本（端口、数据库、可用卡池 format、bot 注册）

## 2. 包级依赖关系（高层）

依赖方向可以概括为：

`@ptcg/common` <- `@ptcg/sets` <- (由 `init.js` 注入到运行时)

`@ptcg/common` <- `@ptcg/server`

`@ptcg/common` <- `@ptcg/play` <- `@ptcg/cordova`（打包复用）

根项目通过 `start.js` + `@ptcg/server` + `@ptcg/sets` 把整个系统串起来。

## 3. 各 package 职责说明

### 3.1 `@ptcg/common`（领域模型与核心规则引擎）

位置：`packages/common`

这是整个系统的“核心领域层”，被 server、sets、play 共同依赖，主要包含：

- `src/game/`：游戏核心模型与流程（如 `CardManager`、`Simulator`、`GameSettings`）
- `src/store/`：状态树、Action、Effect、Reducer、Prompt 等回合驱动机制
- `src/serializer/`：状态序列化、增量同步（json patch）与重放相关能力
- `src/interfaces/`：前后端共享接口定义（登录、资料、卡牌、回放等）
- `src/utils/`：基础工具能力

它定义“规则是什么”，不直接关心“HTTP/数据库/UI 怎么做”。

### 3.2 `@ptcg/sets`（卡牌与卡池实现层）

位置：`packages/sets`

这是卡牌实现仓库，依赖 `@ptcg/common` 的规则抽象，把具体卡牌行为落地为代码：

- `src/base-sets/`：早期基础系列
- `src/ex-sets/`：EX 系列
- `src/standard/`：标准环境系列（例如 DP、HGSS、BW、SWSH 等）
- `src/common/`：卡牌实现复用工具
- `src/index.ts`：按 `baseSets` / `exSets` / `standardSets` 导出

它定义“有哪些卡、每张卡怎么生效”，由运行时（`init.js`）将卡池注册到 `CardManager`。

### 3.3 `@ptcg/server`（后端服务与实时对战编排）

位置：`packages/server`

这是服务端执行层，依赖 `@ptcg/common`，负责把核心规则变成在线服务：

- `src/backend/`
  - `app.ts`：组装 Express、注册 REST 控制器、挂载静态资源
  - `controllers/`：`/v1/login`、`/v1/game`、`/v1/decks`、`/v1/replays` 等接口
  - `socket/`：WebSocket/Socket.IO 实时通信，推送对局与消息更新
- `src/game/`
  - `core/`：在线对局生命周期管理（建局、加入、离开、销毁、消息广播）
  - `bots/` 与任务调度：机器人与系统任务编排
- `src/simple-bot/`：通用 AI（战术选择 + prompt resolver）
- `src/storage/`：TypeORM 模型与存储（sqlite/mysql）
- `src/email/`：邮件模板与发信（如重置密码）

它定义“如何对外提供能力并持久化数据”。

### 3.4 `@ptcg/play`（Angular Web 客户端）

位置：`packages/play`

这是浏览器端 UI，依赖 `@ptcg/common` 共享类型，负责玩家交互：

- `src/app/api/`：HTTP API 服务 + Socket 连接管理 + 拦截器
- `src/app/table/`：对战桌面、手牌/场地、Prompt 交互
- `src/app/games/`：游戏大厅、建房、对局列表
- `src/app/deck/`：牌组管理与编辑
- `src/app/messages/`：私信系统
- `src/app/profile/`：用户资料、头像、密码/邮箱变更
- `src/app/replays/`、`src/app/ranking/`：回放与排行

路由层（`app-routing.module.ts`）组织了登录、大厅、牌组、对局桌面、消息等页面。

### 3.5 `@ptcg/cordova`（Android 容器与移动端适配）

位置：`packages/cordova`

这是移动端包装层，不重新实现业务，而是承载 `@ptcg/play` 构建产物：

- `package.json` 的 `build` 脚本会调用 play 的 cordova 配置构建，输出到 `cordova/www`
- `patch-cordova.js` 对生成资源和 Android 原生入口做补丁（viewport、脚本注入、状态栏、缩放行为）
- 通过 Cordova 插件处理设备能力（文件、状态栏、电源管理等）

它定义“同一套前端在 Android 上如何运行得更稳定”。

## 4. 运行时主链路

系统启动时的关键顺序（见根目录 `start.js` + `init.js`）：

1. 加载 `init.js`，写入运行配置（地址端口、数据库、format、bot）
2. `CardManager` 注册可用 card sets / formats
3. 用已注册卡牌初始化 `StateSerializer`（保证状态序列化可识别卡牌）
4. 创建并启动 `App`：
   - 连接数据库（`Storage`）
   - 初始化 bot 管理器
   - 挂载 Web UI 静态目录（通常是 `packages/play/dist/...`）
   - 下载缺失卡图（扫描图）
   - 启动 HTTP + WebSocket 服务

## 5. 数据与通信分层

- **规则层**：`@ptcg/common`（状态机、动作、效果、提示）
- **内容层**：`@ptcg/sets`（具体卡牌与卡池）
- **服务层**：`@ptcg/server`（REST + WebSocket + 存储 + Bot）
- **展示层**：`@ptcg/play`（Angular 页面与交互）
- **终端封装层**：`@ptcg/cordova`（Android 打包与设备适配）

通信上，客户端主要通过两条通道与服务端交互：

- REST（账号、牌组、排行、回放等资源型接口）
- WebSocket（对战中的实时状态、事件与消息推送）

## 6. package 一览表

| Package | 主要职责 | 关键输入 | 关键输出 |
|---|---|---|---|
| `@ptcg/common` | 规则引擎与共享模型 | 游戏规则抽象、Action/Effect | 可复用的领域逻辑、类型、序列化能力 |
| `@ptcg/sets` | 卡牌与卡池实现 | `common` 的规则基类/接口 | 可注册到 `CardManager` 的 sets/formats |
| `@ptcg/server` | 在线服务编排 | `common` 模型 + `sets` 注册结果 + 配置 | REST/WebSocket 服务、数据库数据、Bot 对局 |
| `@ptcg/play` | Web 客户端 | 服务端 API/Socket + `common` 类型 | 玩家可操作的前端界面 |
| `@ptcg/cordova` | Android 封装 | `play` 构建产物 | 可在 Android 运行的客户端应用 |

## 7. 维护建议（面向后续扩展）

- 新增规则优先落到 `@ptcg/common`，避免前后端分叉逻辑。
- 新增卡牌只改 `@ptcg/sets`，并通过 `init.js`/format 控制可用范围。
- 服务端接口变更时，保持 `@ptcg/common` 接口定义与 `@ptcg/play` API 服务同步更新。
- Android 端问题优先在 `@ptcg/cordova` 层做兼容补丁，尽量不污染主 Web 代码。
