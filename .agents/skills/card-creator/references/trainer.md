# Trainer 卡实现

## 1) 必填字段（按 `TrainerCard` 定义）

来自 `packages/common/src/store/card/trainer-card.ts`：

- `trainerType`（`ITEM` / `SUPPORTER` / `STADIUM` / `TOOL`）
- `text`
- 公共字段：`set`、`name`、`fullName`
- 可选：`useWhenInPlay`

最小模板：

```ts
import { TrainerCard, TrainerType } from '@ptcg/common';

export class MyTrainer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set = 'MY1';
  public name = 'My Trainer';
  public fullName = 'My Trainer MY1';
  public text = 'Do something.';
}
```

## 2) TrainerType 分类型要点

### ITEM

- 一次性使用，通常通过 `TrainerEffect` 执行。
- 复杂流程常见写法：`generator + prompt`。
- 参考：`packages/sets/src/standard/set-black-and-white/ultra-ball.ts`

### SUPPORTER

- 也是 `TrainerEffect`，但受回合规则限制（规则层处理）。
- 参考：`packages/sets/src/standard/set-black-and-white/cheren.ts`

### STADIUM

- 常驻场地效果，通常监听“检查型 effect”（例如 `CheckRetreatCostEffect`）。
- 常会同时拦截 `UseStadiumEffect`（不可主动使用时抛错）。
- 参考：`packages/sets/src/standard/set-black-and-white/skyarrow-bridge.ts`

### TOOL

- 挂在宝可梦上，常在 `KnockOutEffect`、`DealDamageEffect` 等时机触发。
- 参考：`packages/sets/src/standard/set-black-and-white/exp-share.ts`

## 3) 常见实现模式

### A. 打出条件检查

在真正生效前先检查：

- 资源够不够（可弃牌、牌库有目标、场上有可选位）
- 不满足就 `throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD)`

### B. 需要“确认后再丢弃”时

- 设置 `effect.preventDefault = true`
- 在用户完成选择后，手动把 Trainer 移到 discard

这一模式见 `Ultra Ball`。

### C. 可复用逻辑

- 公共 trainer 行为可放到 `packages/sets/src/common/trainers/`。
- 调用方式参考 `packages/sets/src/base-sets/set-jungle/poke-ball.ts`。

## 4) 常见坑

- `trainerType` 设置错误导致规则时机不对。
- 忘记处理 cancel 分支，导致空数组访问。
- 需要延迟丢弃却没 `preventDefault`，出现多丢或提前丢弃。
