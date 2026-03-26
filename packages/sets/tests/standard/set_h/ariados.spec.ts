import {
  AttackEffect,
  CheckRetreatCostEffect,
  Simulator,
} from '@ptcg/common';

import { Arbok } from '../../../src/standard/set_h/arbok';
import { Ariados } from '../../../src/standard/set_h/ariados';
import { TestUtils } from '../../test-utils';

describe('Ariados set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('adds one colorless to the opponent evolved active retreat cost', () => {
    const ariados = new Ariados();
    const { state, opponent } = TestUtils.getAll(sim);

    sim.store.state.players[0].active.pokemons.cards = [ariados];
    opponent.active.pokemons.cards = [new Arbok()];

    const effect = new CheckRetreatCostEffect(opponent);
    ariados.reduceEffect(sim.store, state, effect);

    expect(effect.cost.length).toEqual(3);
  });

  it('adds damage based on the defending retreat cost', () => {
    const ariados = new Ariados();
    const { state, player, opponent } = TestUtils.getAll(sim);

    sim.store.state.players[0].active.pokemons.cards = [ariados];
    opponent.active.pokemons.cards = [new Arbok()];

    const effect = new AttackEffect(player, opponent, ariados.attacks[0]);
    ariados.reduceEffect(sim.store, state, effect);

    expect(effect.damage).toEqual(100);
  });
});
