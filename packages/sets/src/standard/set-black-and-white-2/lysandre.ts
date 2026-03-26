import {
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

import { isProtectedFromOpponentSupporter } from '../../common/trainers/supporter-target-protection';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked = opponent.bench
    .map((slot, index) => ({ slot, index }))
    .filter(({ slot }) => slot.getPokemonCard() === undefined || isProtectedFromOpponentSupporter(state, player.id, slot))
    .map(({ index }) => ({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index }));

  return store.prompt(
    state,
    new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH], {
      allowCancel: false,
      blocked,
    }),
    result => {
      const cardList = result[0];
      if (isProtectedFromOpponentSupporter(state, player.id, cardList)) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }
      opponent.switchPokemon(cardList);
    }
  );
}

export class Lysandre extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW2';

  public name: string = 'Lysandre';

  public fullName: string = 'Lysandre FLF';

  public text: string = 'Switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
