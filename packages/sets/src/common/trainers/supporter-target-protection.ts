import {
  CardTag,
  PokemonCard,
  PokemonSlot,
  State,
  StateUtils,
} from '@ptcg/common';

function isVStarOrVMaxPokemon(card: PokemonCard | undefined): boolean {
  if (card === undefined) {
    return false;
  }

  if (card.tags.includes(CardTag.POKEMON_VSTAR)) {
    return true;
  }

  const rawData = card as any;
  const labels = [
    rawData.rawData?.raw_card?.details?.pokemonTypeLabel,
    rawData.rawData?.api_card?.pokemonTypeLabel,
  ];

  return labels.some((label: unknown) => typeof label === 'string' && label.includes('宝可梦VMAX'));
}

export function isProtectedFromOpponentSupporter(
  state: State,
  actingPlayerId: number,
  target: PokemonSlot
): boolean {
  const owner = StateUtils.findOwner(state, target);
  if (owner === undefined || owner.id === actingPlayerId) {
    return false;
  }

  if (!isVStarOrVMaxPokemon(target.getPokemonCard())) {
    return false;
  }

  return target.trainers.cards.some(card => card.name === '叶隐披风');
}
