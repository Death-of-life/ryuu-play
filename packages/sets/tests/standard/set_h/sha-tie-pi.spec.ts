import {
  AttackAction,
  CardType,
  Simulator,
} from '@ptcg/common';

import { setH } from '../../../src/standard/set_h';
import { ShaTiePi } from '../../../src/standard/set_h/sha-tie-pi';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('ShaTiePi set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('is registered in set_h', () => {
    expect(setH.some(card => card instanceof ShaTiePi)).toBe(true);
  });

  it('adds 70 damage when you have 3 or more energies in play', () => {
    const shaTiePi = new ShaTiePi();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [shaTiePi], [CardType.FIGHTING]);
    player.active.energies.cards = [new TestEnergy(CardType.FIGHTING), new TestEnergy(CardType.FIGHTING)];
    player.bench[0].pokemons.cards = [new TestPokemon()];
    player.bench[0].energies.cards = [new TestEnergy(CardType.GRASS)];
    opponent.active.pokemons.cards = [new TestPokemon()];

    sim.dispatch(new AttackAction(1, '磁场炸裂'));

    expect(opponent.active.damage).toEqual(90);
  });
});
