import {
  AttackEffect,
  CardType,
  Simulator,
} from '@ptcg/common';

import { Absol } from '../../../src/standard/set_h/absol';
import { TestUtils } from '../../test-utils';

describe('Absol set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('adds 50 damage when the player has 3 dark energies in play', () => {
    const absol = new Absol();
    const { state, player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [absol], [CardType.COLORLESS]);
    sim.store.state.players[0].bench[0].pokemons.cards = [new Absol()];
    sim.store.state.players[0].bench[0].energies.cards = TestUtils.makeEnergies([CardType.DARK, CardType.DARK]);
    sim.store.state.players[0].active.energies.cards = TestUtils.makeEnergies([CardType.DARK]);

    const effect = new AttackEffect(player, opponent, absol.attacks[0]);
    absol.reduceEffect(sim.store, state, effect);

    expect(effect.damage).toEqual(70);
  });
});
