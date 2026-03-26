import {
  AttackEffect,
  ApplyWeaknessEffect,
  PlayPokemonEffect,
  Simulator,
} from '@ptcg/common';

import { Ledyba } from '../../../src/standard/set_h/ledyba';
import { Ledian } from '../../../src/standard/set_h/ledian';
import { TestUtils } from '../../test-utils';

describe('Ledian set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('switches in an opponent Benched Pokemon with 90 or less remaining HP when evolved', () => {
    const ledian = new Ledian();
    const ledyba = new Ledyba();
    const { state, player, opponent } = TestUtils.getAll(sim);

    player.active.pokemons.cards = [ledyba];
    opponent.active.pokemons.cards = [new Ledyba()];
    opponent.bench[0].pokemons.cards = [new Ledyba()];
    opponent.bench[0].damage = 10;
    opponent.bench[1].pokemons.cards = [new Ledyba()];

    const effect = new PlayPokemonEffect(player, ledian, player.active);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: unknown) => void) => {
        callback([opponent.bench[0]]);
        return promptState;
      },
      reduceEffect: sim.store.reduceEffect.bind(sim.store),
    } as any;

    ledian.reduceEffect(store, state, effect);

    expect(opponent.active.damage).toEqual(10);
    expect(opponent.bench[0].damage).toEqual(0);
    expect(opponent.active.getPokemonCard()?.name).toEqual('芭瓢虫');
  });

  it('ignores weakness and resistance with 高速星星', () => {
    const ledian = new Ledian();
    const { player, opponent } = TestUtils.getAll(sim);

    const attackEffect = new AttackEffect(player, opponent, ledian.attacks[0]);
    const weaknessEffect = new ApplyWeaknessEffect(attackEffect, 70);
    ledian.reduceEffect(sim.store, sim.store.state, weaknessEffect);

    expect(weaknessEffect.ignoreWeakness).toBe(true);
    expect(weaknessEffect.ignoreResistance).toBe(true);
  });
});
