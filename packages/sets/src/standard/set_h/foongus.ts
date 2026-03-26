import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Foongus extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 17824,
      name: '哎呀球菇',
      yorenCode: 'P590',
      cardType: '1',
      commodityCode: 'CSV8C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '007/207',
      },
      image: '/api/v1/cards/17824/image',
    },
    collection: {
      id: 458,
      commodityCode: 'CSV8C',
      name: '补充包 璀璨诡幻',
    },
    image_url: 'http://localhost:3000/api/v1/cards/17824/image',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '孢子弹',
      cost: [CardType.GRASS],
      damage: '10',
      text: '令对手的战斗宝可梦陷入【睡眠】状态。',
    },
  ];

  public set: string = 'set_h';

  public name: string = '哎呀球菇';

  public fullName: string = '哎呀球菇 CSV8C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialCondition);
      return state;
    }

    return state;
  }
}
