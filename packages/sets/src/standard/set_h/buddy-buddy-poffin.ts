import {
  Card,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonSlot[] = player.bench.filter(b => b.pokemons.cards.length === 0);
  const max = Math.min(slots.length, 2);

  if (max === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  let available = 0;
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.stage === Stage.BASIC && card.hp <= 70) {
      available += 1;
      return;
    }
    blocked.push(index);
  });

  if (available === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 1, max, allowCancel: true, blocked }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index].pokemons);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class BuddyBuddyPoffin extends TrainerCard {
  public rawData = {
    raw_card: {
      id: 16752,
      yorenCode: 'Y1403',
      name: '友好宝芬',
      cardType: '2',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '177/204',
      },
      image: 'img\\324\\484.png',
      hash: '804825349b8e54ff0399b970d3ce7e9d',
    },
    collection: {
      id: 324,
      name: '补充包 利刃猛醒',
      commodityCode: 'CSV7C',
      salesDate: '2026-01-16',
    },
    image_url: 'https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/img/324/484.png',
  };

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'set_h';

  public name: string = 'Buddy-Buddy Poffin';

  public fullName: string = 'Buddy-Buddy Poffin CSV7C';

  public text: string =
    'Search your deck for up to 2 Basic Pokemon with 70 HP or less and put them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
