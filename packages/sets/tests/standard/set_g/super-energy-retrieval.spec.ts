import {
  CardType,
  ChooseCardsPrompt,
  EnergyCard,
  EnergyType,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { SuperEnergyRetrieval } from '../../../src/standard/set_g/super-energy-retrieval';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

class DummyBasicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public energyType: EnergyType = EnergyType.BASIC;

  public set: string = 'TEST';

  public name: string = 'Dummy Basic Energy';

  public fullName: string = 'Dummy Basic Energy TEST';
}

describe('Super Energy Retrieval set_g', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('discards 2 cards and recovers Basic Energy cards from discard', () => {
    const superEnergyRetrieval = new SuperEnergyRetrieval();
    const discardA = new TestCard();
    const discardB = new TestCard();
    const energyA = new DummyBasicEnergy();
    const energyB = new DummyBasicEnergy();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [superEnergyRetrieval, discardA, discardB];
    player.discard.cards = [energyA, energyB];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const discardPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(discardPrompt.id, [discardA, discardB]));
    }).not.toThrow();

    const recoverPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(recoverPrompt.id, [energyA, energyB]));
    }).not.toThrow();

    expect(player.discard.cards).toContain(superEnergyRetrieval);
    expect(player.discard.cards).toContain(discardA);
    expect(player.discard.cards).toContain(discardB);
    expect(player.hand.cards).toContain(energyA);
    expect(player.hand.cards).toContain(energyB);
  });
});
