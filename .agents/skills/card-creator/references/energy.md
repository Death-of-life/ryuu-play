# Energy 卡实现

## 1) 必填字段（按 `EnergyCard` 定义）

来自 `packages/common/src/store/card/energy-card.ts`：

- `provides`
- 公共字段：`set`、`name`、`fullName`
- 特殊能量时应设置：`energyType = EnergyType.SPECIAL`
- 可选：`text`

基础能量最小模板：

```ts
import { CardType, EnergyCard } from '@ptcg/common';

export class MyBasicEnergy extends EnergyCard {
  public provides = [CardType.FIRE];
  public set = 'MY1';
  public name = 'Fire Energy';
  public fullName = 'Fire Energy MY1';
}
```

## 2) 基础能量与特殊能量

### 基础能量

- 只需 `provides`，一般不需要 `reduceEffect`。
- 参考：`packages/sets/src/base-sets/set-base/fire-energy.ts`

### 特殊能量

- 通常需要 `reduceEffect` 动态改 `provides` 或附加副作用。
- 参考：
  - 提供任意色并附带入场伤害：`packages/sets/src/standard/set-black-and-white/rainbow-energy.ts`
  - 附着条件+增伤+不满足条件自动弃置：`packages/sets/src/standard/set-black-and-white-4/strong-energy.ts`

## 3) 特殊能量常见 effect 钩子

- `AttachEnergyEffect`：限制可附着目标，或入场触发。
- `CheckProvidedEnergyEffect`：动态改 `energyMap` 的 `provides`。
- `CheckTableStateEffect`：做状态维护（例如不满足条件则弃牌）。
- `DealDamageEffect`：修改招式伤害。

## 4) 实现建议

- 把“能否附着”与“提供什么能量”分开处理，逻辑更清晰。
- 在 `CheckTableStateEffect` 中只处理与当前卡实例相关的位置，避免全场误改。
- 任何分支未命中时，最后 `return state`。

## 5) 常见坑

- 忘记把特殊能量设为 `EnergyType.SPECIAL`。
- 只改了 `provides` 初始值，却没在 `CheckProvidedEnergyEffect` 中做动态覆盖。
- 条件失效后没清理/弃置，导致状态残留。
