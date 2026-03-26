import {
  AttackEffect,
  CardType,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { AmoongussEx } from '../../../src/standard/set_h/amoonguss-ex';
import { TestUtils } from '../../test-utils';

describe('Amoonguss ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts the defending Pokemon to sleep with Spore Ball', () => {
    const amoongussEx = new AmoongussEx();
    const { state, player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [amoongussEx], [CardType.GRASS]);
    const effect = new AttackEffect(player, opponent, amoongussEx.attacks[0]);
    amoongussEx.reduceEffect(sim.store, state, effect);

    expect(opponent.active.specialConditions).toContain(SpecialCondition.ASLEEP);
  });

  it('adds 80 damage on heads with Mushroom Swing', () => {
    const amoongussEx = new AmoongussEx();
    const { state, player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [amoongussEx], [CardType.GRASS, CardType.COLORLESS]);
    const effect = new AttackEffect(player, opponent, amoongussEx.attacks[1]);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: boolean) => void) => {
        callback(true);
        return promptState;
      },
    } as any;

    amoongussEx.reduceEffect(store, state, effect);

    expect(effect.damage).toEqual(180);
  });

  it('keeps base damage on tails with Mushroom Swing', () => {
    const amoongussEx = new AmoongussEx();
    const { state, player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [amoongussEx], [CardType.GRASS, CardType.COLORLESS]);
    const effect = new AttackEffect(player, opponent, amoongussEx.attacks[1]);
    const store = {
      prompt: (promptState: typeof state, _prompt: unknown, callback: (result: boolean) => void) => {
        callback(false);
        return promptState;
      },
    } as any;

    amoongussEx.reduceEffect(store, state, effect);

    expect(effect.damage).toEqual(100);
  });
});
