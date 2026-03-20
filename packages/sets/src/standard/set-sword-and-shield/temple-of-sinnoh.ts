import {
  AfterCheckProvidedEnergyEffect,
  CardType,
  Effect,
  EnergyType,
  GameError,
  GameMessage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class TempleOfSinnoh extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'SSH';

  public name: string = 'Temple of Sinnoh';

  public fullName: string = 'Temple of Sinnoh ASR';

  public text: string =
    'All Special Energy attached to Pokemon (both yours and your opponent\'s) ' +
    'provides C Energy and has no other effect.';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterCheckProvidedEnergyEffect && StateUtils.getStadiumCard(state) === this) {
      effect.energyMap.forEach(item => {
        if (item.card.energyType === EnergyType.SPECIAL) {
          item.provides = [CardType.COLORLESS];
        }
      });
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }
}
