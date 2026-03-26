import {
  AttackEffect,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Foongus } from '../../../src/standard/set_h/foongus';
import { TestUtils } from '../../test-utils';

describe('Foongus set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts the defending Pokemon to sleep with 孢子弹', () => {
    const foongus = new Foongus();
    const { state, player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [foongus], [CardType.GRASS]);
    const effect = new AttackEffect(player, opponent, foongus.attacks[0]);
    foongus.reduceEffect(sim.store, state, effect);

    expect(opponent.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });
});
