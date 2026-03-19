import {
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GamePhase,
  KnockOutEffect,
  State,
  StoreLike,
} from '@ptcg/common';

export class LegacyEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'CSV8C';

  public name: string = 'Legacy Energy';

  public fullName: string = 'Legacy Energy CSV8C';

  public readonly LEGACY_ENERGY_MARKER = 'LEGACY_ENERGY_MARKER';

  public text: string =
    'As long as this card is attached to a Pokemon, it provides every type of Energy but provides only 1 Energy at a time. ' +
    'If the Pokemon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokemon, ' +
    'that player takes 1 fewer Prize card. This effect of your Legacy Energy can\'t be applied more than once per game.';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      effect.energyMap.forEach(item => {
        if (item.card === this) {
          item.provides = [CardType.ANY];
        }
      });
      return state;
    }

    if (effect instanceof KnockOutEffect && effect.target.energies.cards.includes(this)) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const attackingPlayer = state.players[state.activePlayer];
      if (attackingPlayer === undefined || attackingPlayer === effect.player) {
        return state;
      }

      if (!effect.player.marker.hasMarker(this.LEGACY_ENERGY_MARKER)) {
        effect.prizeCount = Math.max(0, effect.prizeCount - 1);
        effect.player.marker.addMarker(this.LEGACY_ENERGY_MARKER, this);
      }
    }

    return state;
  }
}
