import {
  CardType,
  ChooseCardsPrompt,
  EnergyCard,
  EnergyType,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  ShowCardsPrompt,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { EarthenVessel } from '../../../src/standard/set_g/earthen-vessel';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

class DummyBasicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public energyType: EnergyType = EnergyType.BASIC;

  public set: string = 'TEST';

  public name: string = 'Dummy Basic Energy';

  public fullName: string = 'Dummy Basic Energy TEST';
}

describe('Earthen Vessel set_g', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('discards 1 card and adds up to 2 Basic Energy cards from deck to hand', () => {
    const earthenVessel = new EarthenVessel();
    const discardCard = new TestCard();
    const energyA = new DummyBasicEnergy();
    const energyB = new DummyBasicEnergy();
    const filler = new TestCard();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [earthenVessel, discardCard];
    player.deck.cards = [energyA, energyB, filler];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const discardPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(discardPrompt.id, [discardCard]));
    }).not.toThrow();

    const energyPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(energyPrompt.id, [energyA, energyB]));
    }).not.toThrow();

    const showPrompt = TestUtils.getLastPrompt(sim) as ShowCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(showPrompt.id, true));
    }).not.toThrow();

    expect(player.discard.cards).toContain(earthenVessel);
    expect(player.discard.cards).toContain(discardCard);
    expect(player.hand.cards).toContain(energyA);
    expect(player.hand.cards).toContain(energyB);
    expect(player.deck.cards).toContain(filler);
  });
});
