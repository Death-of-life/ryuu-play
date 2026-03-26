import {
  ChooseCardsPrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { Drakloak } from '../../../src/standard/set_h/drakloak';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe('Drakloak set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts 1 looked-at card into hand and the other on the bottom', () => {
    const drakloak = new Drakloak();
    const topA = new TestCard();
    const topB = new TestCard();
    const third = new TestCard();

    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [drakloak]);
    player.hand.cards = [];
    player.deck.cards = [topA, topB, third];

    sim.dispatch(new UseAbilityAction(1, '侦察指令', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.ACTIVE,
      index: 0,
    }));

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(choosePrompt).toBeTruthy();

    sim.dispatch(new ResolvePromptAction(choosePrompt.id, [topA]));

    expect(player.hand.cards).toContain(topA);
    expect(player.deck.cards).toEqual([third, topB]);

    expect(() => {
      sim.dispatch(new UseAbilityAction(1, '侦察指令', {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.ACTIVE,
        index: 0,
      }));
    }).toThrow();
  });
});
