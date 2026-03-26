import {
  AttackEffect,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Ekans } from '../../../src/standard/set_h/ekans';
import { TestUtils } from '../../test-utils';

describe('Ekans set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('adds Poisoned and Confused on heads with 混合毒液', () => {
    const ekans = new Ekans();
    const { state, player, opponent } = TestUtils.getAll(sim);
    const effect = new AttackEffect(player, opponent, ekans.attacks[0]);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: boolean) => void) => {
        callback(true);
        return promptState;
      },
      reduceEffect: sim.store.reduceEffect.bind(sim.store),
    } as any;

    ekans.reduceEffect(store, state, effect);

    expect(opponent.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  });
});
