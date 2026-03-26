import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Venipede } from '../../../src/standard/set_h/venipede';
import { TestUtils } from '../../test-utils';

describe('Venipede set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('poisons the defending Pokemon with 毒液', () => {
    const venipede = new Venipede();
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [venipede], [CardType.DARK]);

    sim.dispatch(new AttackAction(1, '毒液'));

    expect(opponent.active.specialConditions).toContain(SpecialCondition.POISONED);
  });
});
