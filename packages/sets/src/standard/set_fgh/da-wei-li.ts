import {
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  CardType,
} from '@ptcg/common';

export class DaWeiLi extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 10076,
      name: '大尾狸',
      yorenCode: 'P400',
      cardType: '1',
      commodityCode: 'PROMO3',
      details: {
        regulationMarkText: 'F',
        collectionNumber: '161/S-P',
        rarityLabel: '无标记',
        cardTypeLabel: '宝可梦',
        attributeLabel: '无色',
        specialCardLabel: null,
        hp: 120,
        evolveText: '1阶进化',
        weakness: '斗 ×2',
        resistance: null,
        retreatCost: 2,
      },
      image: '/api/v1/cards/10076/image',
      ruleLines: [],
      attacks: [
        {
          id: 14646,
          name: '长尾粉碎',
          text: '抛掷1次硬币如果为反面，则这个招式失败。',
          cost: ['COLORLESS', 'COLORLESS', 'COLORLESS'],
          damage: '100',
        },
      ],
      features: [
        {
          id: 1923,
          name: '勤奋门牙',
          text: '在自己的回合可以使用1次。从牌库上方抽取卡牌，直到自己的手牌变为5张为止。',
        },
      ],
    },
    collection: {
      id: 32,
      commodityCode: 'PROMO3',
      name: '特典卡·剑&盾',
    },
    image_url: 'http://localhost:3000/api/v1/cards/10076/image',
  };

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = '大牙狸';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: '勤奋门牙',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: '在自己的回合可以使用1次。从牌库上方抽取卡牌，直到自己的手牌变为5张为止。',
    },
  ];

  public attacks = [
    {
      name: '长尾粉碎',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text: '抛掷1次硬币如果为反面，则这个招式失败。',
    },
  ];

  public set: string = 'set_f';

  public name: string = '大尾狸';

  public fullName: string = '大尾狸 161/S-P#10076';

  public readonly DIGGING_MAW_MARKER = 'DIGGING_MAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined || !pokemonSlot.pokemons.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.DIGGING_MAW_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const drawCount = Math.max(0, 5 - player.hand.cards.length);
      if (drawCount > 0) {
        player.deck.moveTo(player.hand, Math.min(drawCount, player.deck.cards.length));
      }
      player.marker.addMarker(this.DIGGING_MAW_MARKER, this);
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DIGGING_MAW_MARKER, this);
      return state;
    }

    return state;
  }
}
