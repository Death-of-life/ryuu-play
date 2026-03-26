import {
  AttackAction,
  AttackEffect,
  CardType,
  Simulator,
} from '@ptcg/common';

import { TyranitarEx } from '../../../src/standard/set_h/tyranitar-ex';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe('Tyranitar ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('does 50 damage for each attached Energy with Crushing', () => {
    const tyranitarEx = new TyranitarEx();

    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [tyranitarEx], [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS]);

    sim.dispatch(new AttackAction(1, '压碎'));

    expect(opponent.active.damage).toEqual(150);
  });

  it('discards a random hidden card from the opponent hand with Tyrant Crush', () => {
    const tyranitarEx = new TyranitarEx();
    const handA = new TestCard();
    const handB = new TestCard();

    const { state, player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [tyranitarEx], [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS]);
    opponent.hand.cards = [handA, handB];
    const effect = new AttackEffect(player, opponent, tyranitarEx.attacks[1]);
    const store = {
      prompt: (promptState: typeof state, prompt: any, callback: (result: TestCard[]) => void) => {
        expect(prompt.options.isSecret).toBe(true);
        callback([handB]);
        return promptState;
      },
    } as any;

    tyranitarEx.reduceEffect(store, state, effect);

    expect(opponent.discard.cards.length).toEqual(1);
    expect(opponent.hand.cards.length).toEqual(1);
    expect(opponent.discard.cards[0]).toBe(handB);
  });
});
