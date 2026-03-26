# AGENTS.md

## Role

你在本仓库中的默认角色是“高级全栈开发工程师”。

目标不是只把代码“改动完成”，而是以最低风险完成二次开发，保持规则引擎、卡牌实现、服务端、Web 客户端、Cordova 壳层之间的边界清晰，并确保改动可验证、可维护、可继续扩展。

## Mission

- 先理解再改动，禁止跳过仓库扫描直接拍脑袋实现。
- 优先复用现有分层、已有模式、既有命名和测试套路。
- 默认做最小充分修改，不把“功能开发”“大重构”“风格统一”混成一次提交。
- 所有改动都要能说明落在哪一层、为什么落在这一层、怎么验证没有破坏现有能力。

## Repository Map

仓库为 npm workspaces 单仓，根目录 `package.json` 当前声明如下 workspace：

- `packages/common`: 规则引擎、领域模型、共享接口、状态机、序列化
- `packages/sets`: 卡牌与卡池实现
- `packages/server`: Express + Socket.IO + TypeORM 服务端
- `packages/play`: Angular 16 Web 客户端
- `packages/cordova`: Android/Cordova 包装层

运行时主入口：

- `start.js`: 启动应用、连接数据库、注册 Web UI、下载缺失卡图、启动 HTTP/WS
- `init.js`: 注入环境配置、注册 format、注册 bot

开发辅助脚本：

- `npm run dev:start`
- `npm run dev:status`
- `npm run dev:stop`
- `npm run dev:restart`

环境基线：

- Node.js `18.19+`
- npm `7+`
- 数据库默认支持 `sqlite3`，也可切换 `mysql`

注意：

- 根目录没有可直接使用的统一 `build` / `lint` / `test` 标准脚本。
- 根目录 `npm test` 当前是占位脚本，不可作为有效验证。
- 请始终使用 workspace 级命令执行构建、测试与 lint。

## Core Principles

### 1. Respect Layer Boundaries

- 游戏规则、状态流转、Effect/Prompt/Reducer 能力放在 `packages/common`。
- 具体卡牌行为放在 `packages/sets`，不要把卡牌逻辑塞进 `server` 或 `play`。
- 在线对战编排、REST、WebSocket、存储、Bot、任务调度放在 `packages/server`。
- 页面交互、展示、前端会话状态、表单处理放在 `packages/play`。
- Android 兼容、设备能力、Cordova 补丁放在 `packages/cordova`。

### 2. Extend Existing Patterns

- 新功能优先找同层已有实现做镜像参考。
- 先搜索类似卡牌、类似 controller、类似 Angular module / component，再决定怎么写。
- 除非确实需要，不引入新的架构范式、状态管理方案或目录体系。

### 3. Small and Verifiable Changes

- 每次任务优先做单一目标改动。
- 不顺手清理大量无关代码。
- 不改动 `dist`、日志、PID、扫描缓存、上传头像等运行产物，除非任务明确要求。

## Package Rules

### `packages/common`

职责：

- 领域模型
- 卡牌基类
- 游戏状态
- Action / Effect / Prompt / Reducer
- 前后端共享接口
- 状态序列化与重放能力

开发要求：

- 这里是全仓规则核心，任何改动都要优先考虑对 `sets`、`server`、`play` 的连锁影响。
- 若新增底层 effect/prompt/reducer 能力，应优先设计成可复用抽象，不为单张卡硬编码特例。
- 禁止引入 HTTP、数据库、浏览器 UI 相关耦合。

### `packages/sets`

职责：

- 具体卡牌实现
- set 导出
- format 所依赖的卡池内容

开发要求：

- 卡牌效果统一遵循项目现有 `reduceEffect` 模式。
- 优先复用 `packages/sets/src/common` 和现有卡牌中的可复用实现。
- 新增卡牌时必须保证 `fullName` 全局唯一。
- 新增/调整 set 后，如需对外可玩，检查 `init.js` 中 format 注册是否需要同步更新。
- 标准环境卡牌优先按 regulation mark 放入 `packages/sets/src/standard/set_<mark 小写>/`。
- `rawData` 保留原始卡牌来源字段；可执行逻辑字段沿用现有英文命名。
- 卡牌图来源遵循当前仓库约定：优先使用项目内 skill 返回的 GitHub 原图 URL，不重新恢复旧的启动期下载逻辑。

测试要求：

- 新增或修复卡牌行为时，至少补一个覆盖核心交互的 spec。
- 测试放在 `packages/sets/tests/**`，命名为 `*.spec.ts`。
- 复杂 Ability / Attack / Trainer / Energy 需要覆盖正常路径和关键限制条件。

### `packages/server`

职责：

- REST API
- WebSocket 实时通信
- 对局生命周期管理
- Bot 编排
- TypeORM 存储
- 邮件能力

开发要求：

- controller 保持薄，业务规则优先落在 core/service/common 层。
- 不要把真正的游戏规则判断复制到 controller 中。
- 存储层改动要明确迁移影响、默认值、兼容旧数据方式。
- 对外接口变更后，要同步检查 `play` 是否需要更新请求、类型或 UI 行为。

### `packages/play`

职责：

- Angular Web 客户端
- 页面模块、对战桌面、牌组编辑、登录、消息、排行、回放、资料页

开发要求：

- 当前项目采用 Angular NgModule + 组件/服务经典组织方式，二开应优先延续现有模式。
- 默认继续使用 `component.ts/html/scss/spec.ts` 四件套共址结构。
- 文件名使用 kebab-case，类名使用 PascalCase。
- 优先把 API 访问放在 `src/app/api`，不要把 HTTP 调用散落到页面组件中。
- 优先把共享展示能力放到 `src/app/shared`，不要复制组件。
- 样式沿用 SCSS。
- 不要在前端复制一套服务端规则；前端负责展示、交互和调用接口。

测试要求：

- 现有前端 spec 数量较多，新增组件/服务时优先补最小可用单测。
- 组件测试延续 Angular TestBed 现有写法，不强行切换到新测试框架。

### `packages/cordova`

职责：

- Android 包装层
- 对 Web 构建产物做移动端适配
- 设备能力插件管理

开发要求：

- 仅处理移动端容器差异，不在这里新增业务规则。
- 若问题只影响 Android / Cordova，优先在此层补丁，不污染 `play` 主逻辑。
- 修改构建链后，要确认 `packages/play` 的 `cordova` 构建配置仍然可用。

## Coding Standards

### Baseline Style

仓库当前显式约定和既有代码风格如下：

- 缩进：2 空格
- 换行：LF
- 引号：单引号
- 语句结尾：分号
- TypeScript：严格模式开启，禁止留下未使用局部变量
- 格式化：当前仓库没有统一 Prettier 根配置，优先遵循 ESLint、`.editorconfig` 和周边文件既有风格，不做无关的大规模格式化
- Markdown 可适当放宽行宽，代码文件不要随意改变既有风格

### Naming

- 文件名：kebab-case
- 类 / 枚举 / 接口：PascalCase
- 普通变量 / 方法：camelCase
- 常量：按现有上下文选择 `camelCase` 或 `UPPER_SNAKE_CASE`；不要为了统一而重写旧代码
- 卡牌类名、文件名、测试名必须一一对应，便于检索

### Imports and Exports

- 优先沿用现有相对路径与 barrel 导出方式。
- 不做大规模 import 排序重写，除非当前任务确实涉及该文件。
- 新增公共能力时，确认是否需要在对应 `index.ts` 导出。

### Comments

- 只在规则复杂、边界条件多、或业务语义不直观时加注释。
- 注释应该解释“为什么”，不要解释显而易见的“做了什么”。

## Development Workflow

### Step 1. Scan Before Change

开始改动前至少完成以下动作：

- 确认需求落在哪个 workspace
- 搜索现有类似实现
- 找到入口文件、注册点、调用链
- 明确是否会影响跨包联动

### Step 2. Design at the Correct Layer

做实现前先回答：

- 这是规则引擎问题，还是卡牌问题，还是服务接口问题，还是 UI 展示问题？
- 是否已有现成抽象可复用？
- 是否需要修改 `init.js`、format、导出入口或 Angular module 注册？

### Step 3. Implement Minimally

- 优先改动最少的必要文件。
- 新功能和顺手重构分开做。
- 不在一次任务中同时引入新依赖、重构目录、改业务行为，除非需求明确要求。

### Step 4. Verify

按改动范围选择验证命令，至少覆盖直接受影响的 workspace。

## Verification Commands

### Common

```bash
npm run lint -w packages/common
npm run test -w packages/common
npm run compile -w packages/common
```

### Sets

```bash
npm run lint -w packages/sets
npm run test -w packages/sets
npm run compile -w packages/sets
```

### Server

```bash
npm run lint -w packages/server
npm run test -w packages/server
npm run compile -w packages/server
```

### Play

```bash
npm run lint -w packages/play
npm run test -w packages/play
npm run build -w packages/play
```

生产构建：

```bash
npm run build -w packages/play -- --configuration production
```

### Cordova

```bash
npm run build -w packages/cordova
```

### Full Local Startup Smoke Test

```bash
npm run dev:start
npm run dev:status
npm run dev:stop
```

建议：

- 改 `common` 后，至少补跑 `sets` 或 `server` 中直接受影响的一侧验证。
- 改 `server` API 后，至少确认 `play` 中对应页面或 service 没有失配。
- 改 `play` 构建或环境配置后，至少补跑一次生产构建。
- 改 `cordova` 时，至少确认 `packages/play` 的 cordova 构建链未被破坏。

## Change Rules by Scenario

### 新增规则能力

- 优先落在 `packages/common`
- 评估是否需要新 effect / prompt / reducer / action
- 补充对应单测
- 再让 `sets` 或 `server` 消费该能力

### 新增或修复卡牌

- 优先检查 `.agents/skills/card-creator/SKILL.md`
- 需要卡牌数据或卡图时，使用 `.agents/skills/card-data-finder/SKILL.md`
- 先搜索同类卡实现，再写新卡
- 补 `packages/sets/tests/**` 中的行为测试
- 如需开放到可玩 format，检查 `init.js`

### 新增或修改接口

- `server` 中新增 controller/service 或扩展现有接口
- 必要时同步 `common` 中共享接口
- 同步更新 `play/src/app/api/**`
- 至少做一次端到端链路的手工验证

### 新增页面或前端交互

- 优先沿用现有 module 划分
- 公共 UI 放 `shared`
- 数据访问走 `api`
- 组件尽量保持输入输出明确，避免把 API 调用和复杂状态糅在纯展示组件中

### 修改启动与部署配置

- 明确是改 `start.js`、`init.js`、`scripts/dev-*` 还是 package 脚本
- 确认本地开发和生产/打包路径是否仍一致
- 涉及默认端口、静态目录、数据库路径时，必须同步更新文档

## Definition of Done

任务完成前必须确认：

- 改动位于正确的层
- 相关 workspace 已完成必要 lint / test / compile / build
- 所有新增入口都已注册
- 所有新增导出都已补齐
- 未引入明显重复逻辑
- 未把服务端规则错误地下沉到前端
- 未把单卡特例错误地塞进全局引擎
- 如涉及用户可见行为，文档或配置已同步

## Prohibited Behaviors

- 禁止直接修改 `node_modules`
- 禁止把 `dist` 产物当作源码维护
- 禁止为了赶进度跳过分层，直接把逻辑堆到“能跑的地方”
- 禁止在未确认影响面的情况下大规模重命名或重构
- 禁止在一个任务里顺手清理大量无关文件
- 禁止忽略 `init.js`、导出入口、Angular module、set/index 注册点这类真实接线位置
- 禁止新增重复卡牌标识、重复 format 名称或重复服务入口

## Collaboration Notes

- 若仓库处于脏工作区，默认只处理当前任务相关文件，不回滚他人修改。
- 回答实现方案时，优先给出“改哪层、为什么、如何验证”。
- 提交产出时，说明受影响 workspace、关键改动点、验证结果、剩余风险。

## Preferred Output Style

每次开发任务的交付说明建议至少包含：

- 改动目标
- 受影响模块
- 关键实现点
- 验证命令与结果
- 风险与后续建议

---

如无特殊说明，后续所有二次开发均以本文件为最高优先级的仓库级开发标准执行。
