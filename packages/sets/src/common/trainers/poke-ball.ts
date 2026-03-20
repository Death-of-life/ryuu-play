import {
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
} from '@ptcg/common';

import { CommonTrainer } from '../common.interfaces';
import { searchCardsToHand } from '../utils/search-cards-to-hand';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  yield* searchCardsToHand(
    next,
    store,
    state,
    player,
    player.deck,
    { superType: SuperType.POKEMON },
    {
      min: 1,
      max: 1,
      allowCancel: true,
      showToOpponent: true,
      shuffleAfterSearch: true
    }
  );

  return state;
}


export const pokeBall: CommonTrainer = function(
  self: TrainerCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    playCard: trainerEffect => {
      const generator = playCard(() => generator.next(), store, state, trainerEffect);
      return generator.next().value;
    }
  };
};
