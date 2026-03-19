import {
  Effect,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Iono extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CSV8C';

  public name: string = 'Iono';

  public fullName: string = 'Iono CSV8C';

  public text: string =
    'Each player shuffles all cards in their hand and puts them on the bottom of their deck. ' +
    'Then, each player draws cards equal to their remaining Prize cards.';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerHandCards = player.hand.cards.filter(card => card !== this);
      const opponentHandCards = opponent.hand.cards.slice();
      const playerMovedCount = playerHandCards.length;
      const opponentMovedCount = opponentHandCards.length;

      player.hand.moveCardsToBottom(playerHandCards, player.deck);
      opponent.hand.moveCardsToBottom(opponentHandCards, opponent.deck);

      if (playerMovedCount + opponentMovedCount > 0) {
        opponent.deck.moveTo(opponent.hand, opponent.getPrizeLeft());
        player.deck.moveTo(player.hand, player.getPrizeLeft());
      }
    }

    return state;
  }
}
