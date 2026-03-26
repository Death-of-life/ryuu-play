import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Ralts extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 12790,
      name: '拉鲁拉丝',
      yorenCode: 'P280',
      cardType: '1',
      commodityCode: 'CSV2C',
      details: {
        regulationMarkText: 'G',
        collectionNumber: '132/128',
        rarityLabel: 'AR',
        cardTypeLabel: '宝可梦',
        attributeLabel: '超',
        trainerTypeLabel: null,
        energyTypeLabel: null,
        pokemonTypeLabel: null,
        specialCardLabel: null,
        hp: 70,
        evolveText: '基础',
        weakness: '恶 ×2',
        resistance: '斗 -30',
        retreatCost: 1,
      },
      image: '/api/v1/cards/12790/image',
      ruleLines: [],
      attacks: [
        {
          id: 6884,
          name: '精神射击',
          text: '',
          cost: ['超', '无色'],
          damage: '30',
        },
      ],
      features: [],
      illustratorNames: ['Jiro Sasumo'],
      pokemonCategory: '心情宝可梦',
      pokedexCode: '0280',
      pokedexText: '它可以使用头上红色的角来敏锐地捕捉到人类的情感。',
      height: 0.4,
      weight: 6.6,
      deckRuleLimit: null,
    },
    collection: {
      id: 253,
      commodityCode: 'CSV2C',
      name: '补充包 奇迹启程',
    },
    image_url: 'http://212.52.0.192:3000/api/v1/cards/12790/image',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '精神射击',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text: '',
    },
  ];

  public set: string = 'set_g';

  public name: string = '拉鲁拉丝';

  public fullName: string = '拉鲁拉丝 CSV2C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
