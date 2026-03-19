import {
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  Effect,
  EndTurnEffect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class GholdengoEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gimmighoul';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Coin Bonus',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn, you may draw a card. ' +
        'If this Pokemon is in the Active Spot, draw 1 more card.',
    },
  ];

  public attacks = [
    {
      name: 'Make It Rain',
      cost: [CardType.METAL],
      damage: '50x',
      text:
        'You may discard any number of Basic Energy cards from your hand. ' +
        'This attack does 50 damage for each card you discarded in this way.',
    },
  ];

  public set: string = 'CSV4C';

  public name: string = 'Gholdengo ex';

  public fullName: string = 'Gholdengo ex CSV4C';

  public readonly COIN_BONUS_MARKER = 'COIN_BONUS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.COIN_BONUS_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.COIN_BONUS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const drawCount = player.active.getPokemonCard() === this ? 2 : 1;
      player.deck.moveTo(player.hand, Math.min(drawCount, player.deck.cards.length));
      player.marker.addMarker(this.COIN_BONUS_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const maxCards = player.hand.cards.filter(
        c => c instanceof EnergyCard && c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC
      ).length;

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: maxCards, allowCancel: false }
        ),
        selected => {
          const cards = selected || [];
          player.hand.moveCardsTo(cards, player.discard);
          effect.damage = cards.length * 50;
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.COIN_BONUS_MARKER, this);
      return state;
    }

    return state;
  }
}
