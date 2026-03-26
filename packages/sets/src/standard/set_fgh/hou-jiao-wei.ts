import {
  AttackEffect,
  CardTag,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function isAncientPokemon(card: PokemonCard | undefined): boolean {
  if (card === undefined) {
    return false;
  }

  const rawData = card as any;
  const labels = [
    rawData.rawData?.raw_card?.details?.specialCardLabel,
    rawData.rawData?.api_card?.specialCardLabel,
  ];

  return labels.some((label: unknown) => label === '古代');
}

export class HouJiaoWei extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 16692,
      name: '吼叫尾',
      yorenCode: 'P0985',
      cardType: '1',
      commodityCode: 'CSV7C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '107/204',
        rarityLabel: 'C★★★',
        cardTypeLabel: '宝可梦',
        attributeLabel: '超',
        trainerTypeLabel: null,
        energyTypeLabel: null,
        pokemonTypeLabel: null,
        specialCardLabel: '古代',
        hp: 90,
        evolveText: '基础',
        weakness: '恶 ×2',
        resistance: '斗 -30',
        retreatCost: 1,
      },
      image: '/api/v1/cards/16692/image',
      ruleLines: [],
      attacks: [
        {
          id: 2165,
          name: '歌唱激励',
          text: '回复自己备战区中的1只「古代」宝可梦「100」HP。',
          cost: ['无色'],
          damage: null,
        },
        {
          id: 2166,
          name: '巨声',
          text: '',
          cost: ['无色', '无色'],
          damage: '40',
        },
      ],
      features: [],
      illustratorNames: ['kawayoo'],
      pokemonCategory: '悖谬宝可梦',
      pokedexCode: '0985',
      pokedexText: '过去只有１次目击纪录。这只宝可梦与古老的探险记所记载的神秘生物长得很像。',
      height: 1.2,
      weight: 8,
      deckRuleLimit: null,
    },
    collection: {
      id: 324,
      commodityCode: 'CSV7C',
      name: '补充包 利刃猛醒',
    },
    image_url: 'http://localhost:3000/api/v1/cards/16692/image',
  };

  public tags = [CardTag.TERA];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '歌唱激励',
      cost: [CardType.COLORLESS],
      damage: '',
      text: '回复自己备战区中的1只「古代」宝可梦「100」HP。',
    },
    {
      name: '巨声',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: '',
    },
  ];

  public set: string = 'set_h';

  public name: string = '吼叫尾';

  public fullName: string = '吼叫尾 107/204#16692';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const blocked = player.bench
        .map((slot, index) => {
          if (slot.pokemons.cards.length === 0 || !isAncientPokemon(slot.getPokemonCard())) {
            return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index };
          }
          return null;
        })
        .filter((target): target is { player: PlayerType; slot: SlotType; index: number } => target !== null);

      if (blocked.length === player.bench.length) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, blocked }
        ),
        targets => {
          const target = (targets || [])[0];
          if (target === undefined) {
            return;
          }
          const healEffect = new HealEffect(player, target, Math.min(100, target.damage));
          store.reduceEffect(state, healEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage = 40;
      return state;
    }

    return state;
  }
}
