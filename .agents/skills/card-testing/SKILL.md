---
name: card-testing
description: 在 Ryuu Play 中验证卡牌效果、Prompt 流程与真实对局链路。只要用户提到“测试卡牌效果”“验证招式/特性/道具是否符合预期”“用测试实验室开局”“用 Chrome MCP 复现卡牌问题”，都应优先使用此 skill。
---

# Card Testing

用于验证卡牌在真实运行链路中的表现，而不是只看单测是否通过。

这个 skill 面向三类场景：

1. 新增卡牌后验证效果
2. 修复卡牌 bug 后回归测试
3. 检查 Prompt 次数、卡区移动、伤害/指示物、日志与前后端交互是否一致

## 依赖的现有能力

### 前端测试入口
- 页面：`/testing`
- 组件：`packages/play/src/app/testing/testing.component.ts`

### 后端测试接口
- 文档基线：`http://127.0.0.1:3000/api/docs`
- 创建测试局：`POST /v1/testing/create`
- 控制器：`packages/server/src/backend/controllers/testing.ts`

### 真实对局页面
- 牌桌：`/table/:id`
- 创建后会直接进入真实规则引擎，不是 mock 页面

## 标准流程

1. 确认服务已经用根目录 `npm start` 启动。
2. 确认目标卡已经接入当前 format，且牌组有效。
3. 选择一种测试方式：
   - 快速人工验证：打开 `/testing`
   - 接口验证：调用 `POST /v1/testing/create`
   - 复杂复现：创建专用测试牌组，再用 Chrome MCP 进入 `/table/:id`
4. 创建一局测试对局，至少指定：
   - `playerDeckId`
   - `botDeckId`
   - `formatName`
5. 进入牌桌后，重点观察：
   - 是否出现多余或缺失的 prompt
   - 卡牌是否进入正确卡区
   - 伤害 / 伤害指示物 / 异常状态是否正确
   - 能量支付与减费是否正确
   - 日志是否与效果一致
   - 前后端是否出现不同步或重复提交
6. 如果行为不对：
   - 先判断问题在 `common`、`sets` 还是 `play`
   - 修完后重新走同一条测试链路复测

## 重点断言清单

### 规则侧
- 招式/特性/道具是否只执行一次
- 使用限制是否生效
- 目标选择是否合法
- 伤害与指示物是否符合文本
- 弃牌区 / 放逐区 / 手牌 / 牌库 / 备战区变化是否正确

### 前端侧
- prompt 是否出现多一次或少一次
- 点击 `OK/Cancel` 是否会重复提交
- 选择窗口关闭时机是否正确
- 详情弹窗、牌区显示、日志文案是否与规则一致

### 数据侧
- 卡图是否来自本地 `3000`
- 同逻辑多卡图是否折叠为一张逻辑卡
- 选卡图时是否能看到完整 variant 列表

## 推荐输出格式

每次测试结束，至少记录：

1. 测试入口
   - `/testing` 或 `POST /v1/testing/create`
2. 使用牌组
3. 复现步骤
4. 预期结果
5. 实际结果
6. 定位层级
   - `packages/common`
   - `packages/sets`
   - `packages/play`
7. 修复后验证结果

## 注意事项

- 这个 skill 用于“验证真实行为”，不是替代 `packages/sets/tests/**` 单测。
- 复杂卡牌至少要做两层验证：
  - 单测
  - 测试实验室 / 浏览器真实链路
- 如果当前引擎缺少测试所需的局面注入能力，先用最小测试牌组复现，不要跳过验证。
