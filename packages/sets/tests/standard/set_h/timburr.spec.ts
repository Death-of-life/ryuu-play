import {
  AttackEffect,
  Simulator,
} from '@ptcg/common';

import { Timburr } from '../../../src/standard/set_h/timburr';
import { TestUtils } from '../../test-utils';

describe('Timburr set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('keeps damage on heads with 全力重拳', () => {
    const timburr = new Timburr();
    const { state, player, opponent } = TestUtils.getAll(sim);
    const effect = new AttackEffect(player, opponent, timburr.attacks[0]);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: boolean) => void) => {
        callback(true);
        return promptState;
      },
    } as any;

    timburr.reduceEffect(store, state, effect);

    expect(effect.damage).toEqual(40);
  });

  it('sets damage to zero on tails with 全力重拳', () => {
    const timburr = new Timburr();
    const { state, player, opponent } = TestUtils.getAll(sim);
    const effect = new AttackEffect(player, opponent, timburr.attacks[0]);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: boolean) => void) => {
        callback(false);
        return promptState;
      },
    } as any;

    timburr.reduceEffect(store, state, effect);

    expect(effect.damage).toEqual(0);
  });
});
