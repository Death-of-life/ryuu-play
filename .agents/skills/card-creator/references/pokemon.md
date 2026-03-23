# Pokemon 卡实现

## 1) 必填字段（按 `PokemonCard` 定义）

来自 `packages/common/src/store/card/pokemon-card.ts`：

- `stage`
- `cardTypes`
- `hp`
- `weakness`（可空数组）
- `resistance`（可空数组）
- `retreat`
- `attacks`
- 可选：`evolvesFrom`、`powers`、`tags`
- 继承自 `Card` 的公共字段：`set`、`name`、`fullName`

### 字段语言约定（重要）

- `rawData` 中的 `raw_card/collection/image_url` 保持中文来源数据原样（便于追溯到 PTCG-CHS 与卡图）。
- 卡牌实现字段使用英文：`powers[].name/text`、`attacks[].name/text`、`public text`、`fullName` 等。
- 即：**数据源元信息中文，游戏逻辑文本英文**。

最小模板：

```ts
import { CardType, PokemonCard, Stage } from '@ptcg/common';

export class MyPokemon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardTypes: CardType[] = [CardType.FIRE];
  public hp = 70;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    { name: 'Flare', cost: [CardType.FIRE], damage: '20', text: '' },
  ];

  public set = 'MY1';
  public name = 'My Pokemon';
  public fullName = 'My Pokemon MY1';
}
```

## 2) Attack 常见实现

### A. 纯数据攻击（不需要 `reduceEffect`）

- 只在 `attacks` 里声明 cost/damage/text 即可。
- 适合“固定伤害、无额外效果”的招式。

### B. 在 `reduceEffect` 里按招式分支处理

常见写法（见 `packages/sets/src/standard/set-sword-and-shield/charmander.ts`）：

```ts
if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
  // 处理该攻击附加效果
}
```

建议：按 `this.attacks[index]` 与数组顺序一一对应，减少名称字符串比较错误。

### C. 复杂攻击用 generator + prompt

- 适用于“先选牌、再移动、再洗切”等多步骤流程。
- 参考：`packages/sets/src/standard/set-black-and-white/emolga.ts`（Call for Family）。

## 3) Ability / Power 常见实现

### A. Ability（持续或可多次使用）

- 在 `powers` 中声明 `powerType: PowerType.ABILITY`。
- 在 `reduceEffect` 中监听 `PowerEffect` 或 `CheckTableStateEffect`。

参考：

- 手贴能量类能力：`packages/sets/src/standard/set-black-and-white-3/blastoise.ts`
- 状态免疫类持续能力：`packages/sets/src/standard/set-black-and-white-3/virizion-ex.ts`

### B. 使用前校验（很关键）

常见校验包括：

- 是否在正确区域（Active/Bench）
- 是否有可选目标
- 是否有可支付资源（手牌/能量/可选攻击）

校验失败应抛 `GameError(GameMessage.CANNOT_USE_POWER)` 或对应消息。

## 4) 推荐复用 common helpers

- 公共攻击封装在 `packages/sets/src/common/attacks/`，如 `call-for-family`、`metronome`。
- 复用示例：`packages/sets/src/base-sets/set-jungle/clefable.ts` 使用 `commonAttacks.metronome`。

这样能减少重复逻辑，并保持不同卡牌行为一致。

## 5) 常见坑

- `fullName` 与其它卡重复。
- 忘记把卡实例加入 set 的 `index.ts` 数组。
- `attacks` 顺序改了，但 `this.attacks[index]` 分支没同步。
- prompt 流程中未处理 `allowCancel` 后的空选择。
