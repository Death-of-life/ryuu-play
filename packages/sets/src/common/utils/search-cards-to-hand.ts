import {
  Card,
  CardList,
  ChooseCardsPrompt,
  FilterType,
  GameMessage,
  Player,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  State,
  StateUtils,
  StoreLike
} from '@ptcg/common';

export interface SearchCardsToHandOptions {
  min?: number;
  max?: number;
  allowCancel?: boolean;
  showToOpponent?: boolean;
  shuffleAfterSearch?: boolean;
  promptMessage?: GameMessage;
  revealMessage?: GameMessage;
}

export function* searchCardsToHand(
  next: Function,
  store: StoreLike,
  state: State,
  player: Player,
  source: CardList,
  filter: FilterType,
  options: SearchCardsToHandOptions = {}
): IterableIterator<State> {
  const {
    min = 1,
    max = 1,
    allowCancel = true,
    showToOpponent = true,
    shuffleAfterSearch = true,
    promptMessage = GameMessage.CHOOSE_CARD_TO_HAND,
    revealMessage = GameMessage.CARDS_SHOWED_BY_THE_OPPONENT
  } = options;

  const opponent = StateUtils.getOpponent(state, player);
  let selectedCards: Card[] = [];

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      promptMessage,
      source,
      filter,
      { min, max, allowCancel }
    ),
    cards => {
      selectedCards = cards || [];
      next();
    }
  );

  source.moveCardsTo(selectedCards, player.hand);

  if (showToOpponent && selectedCards.length > 0) {
    yield store.prompt(
      state,
      new ShowCardsPrompt(opponent.id, revealMessage, selectedCards),
      () => next()
    );
  }

  if (shuffleAfterSearch) {
    yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      source.applyOrder(order);
    });
  }

  return state;
}
