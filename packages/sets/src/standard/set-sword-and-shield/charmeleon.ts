import { AttackEffect, CardType, Effect, MoveDeckCardsToDiscardEffect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.FIRE],
      damage: '20',
      text: '',
    },
    {
      name: 'Raging Flames',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '60',
      text: 'Discard the top 3 cards of your deck.',
    },
  ];

  public set: string = 'SSH';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.reduceEffect(
        state,
        new MoveDeckCardsToDiscardEffect(player, player, player.deck, player.deck.top(3))
      );
    }

    return state;
  }
}
