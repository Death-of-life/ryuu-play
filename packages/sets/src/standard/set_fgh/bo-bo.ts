import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useBirdCall(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const playerType = state.players[0] === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;
  const emptySlots = player.bench.filter(slot => slot.pokemons.cards.length === 0);
  const basicCards = player.deck.cards.filter(card => {
    return card.superType === SuperType.POKEMON && (card as PokemonCard).stage === Stage.BASIC;
  });

  if (emptySlots.length === 0 || basicCards.length === 0) {
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
      next();
    });
  }

  const max = Math.min(2, emptySlots.length, basicCards.length);
  let selected: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max, allowCancel: false }
    ),
    cards => {
      selected = cards || [];
      next();
    }
  );

  selected.forEach((card, index) => {
    player.deck.moveCardTo(card, emptySlots[index].pokemons);
    emptySlots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next();
  });
}

export class BoBo extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 11516,
      name: '波波',
      yorenCode: 'P016',
      cardType: '1',
      commodityCode: '151C4',
      details: {
        regulationMarkText: 'G',
        collectionNumber: '153/151',
        rarityLabel: 'S',
        cardTypeLabel: '宝可梦',
        attributeLabel: '无色',
        specialCardLabel: null,
        hp: 50,
        evolveText: '基础',
        weakness: '雷 ×2',
        resistance: '斗 -30',
        retreatCost: 1,
      },
      image: '/api/v1/cards/11516/image',
      ruleLines: [],
      attacks: [
        {
          id: 4925,
          name: '呼朋引伴',
          text: '选择自己牌库中最多2张【基础】宝可梦，放于备战区。并重洗牌库。',
          cost: ['COLORLESS'],
          damage: '',
        },
        {
          id: 4926,
          name: '撞击',
          text: '',
          cost: ['COLORLESS', 'COLORLESS'],
          damage: '20',
        },
      ],
      features: [],
    },
    collection: {
      id: 280,
      commodityCode: '151C4',
      name: '收集啦151 聚',
    },
    image_url: 'http://localhost:3000/api/v1/cards/11516/image',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '呼朋引伴',
      cost: [CardType.COLORLESS],
      damage: '',
      text: '选择自己牌库中最多2张【基础】宝可梦，放于备战区。并重洗牌库。',
    },
    {
      name: '撞击',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'set_g';

  public name: string = '波波';

  public fullName: string = '波波 153/151#11516';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useBirdCall(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
