import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Arbok } from '../../../src/standard/set_h/arbok';
import { TestUtils } from '../../test-utils';

describe('Arbok set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('adds Poisoned Burned and Confused with 恐慌毒液', () => {
    const arbok = new Arbok();
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [arbok], [CardType.DARK]);

    sim.dispatch(new AttackAction(1, '恐慌毒液'));

    expect(opponent.active.specialConditions).toContain(SpecialCondition.POISONED);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.BURNED);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  });
});
