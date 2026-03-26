import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { BlackKyuremEx } from '../../../src/standard/set_h/black-kyurem-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Black Kyurem ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('paralyzes a Dragon defending Pokemon with Ice Age', () => {
    const blackKyuremEx = new BlackKyuremEx();
    const dragonPokemon = new TestPokemon();
    dragonPokemon.cardTypes = [CardType.DRAGON];

    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [blackKyuremEx], [CardType.WATER, CardType.WATER, CardType.WATER]);
    TestUtils.setDefending(sim, [dragonPokemon]);

    sim.dispatch(new AttackAction(1, '冰雪时代'));

    expect(opponent.active.damage).toEqual(90);
    expect(opponent.active.specialConditions).toContain(SpecialCondition.PARALYZED);
  });

  it('does 30 damage to itself with Dark Frost', () => {
    const blackKyuremEx = new BlackKyuremEx();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [blackKyuremEx], [CardType.COLORLESS, CardType.COLORLESS, CardType.WATER, CardType.WATER]);

    sim.dispatch(new AttackAction(1, '暗黑冰霜'));

    expect(opponent.active.damage).toEqual(250);
    expect(player.active.damage).toEqual(30);
  });
});
