import {
  Attack,
  AttackEffect,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  EndTurnEffect,
  Effect,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  UseTrainerInPlayEffect,
} from '@ptcg/common';

export const TM_USED_MARKER = 'TM_USED_MARKER';

export function ensureTmActiveUse(effect: UseTrainerInPlayEffect): void {
  if (effect.target !== effect.player.active) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
}

export function prepareTmAttack(
  store: StoreLike,
  state: State,
  effect: UseTrainerInPlayEffect,
  attack: Attack
): { state: State; player: Player; opponent: Player; attackEffect: AttackEffect } {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const checkAttackCost = new CheckAttackCostEffect(player, attack);
  state = store.reduceEffect(state, checkAttackCost);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, effect.target);
  state = store.reduceEffect(state, checkProvidedEnergy);

  if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }

  const attackEffect = new AttackEffect(player, opponent, attack);
  return { state, player, opponent, attackEffect };
}

export function markTmUsed(player: Player, trainerCard: TrainerCard): void {
  player.marker.addMarker(TM_USED_MARKER, trainerCard);
}

export function discardTmAtEndTurn(state: State, effect: Effect, self: TrainerCard): State {
  if (!(effect instanceof EndTurnEffect)) {
    return state;
  }

  const cardList = StateUtils.findCardList(state, self);
  const owner = StateUtils.findOwner(state, cardList);
  if (owner !== undefined && effect.player === owner && owner.marker.hasMarker(TM_USED_MARKER, self)) {
    cardList.moveCardTo(self, owner.discard);
    owner.marker.removeMarker(TM_USED_MARKER, self);
  }

  return state;
}
