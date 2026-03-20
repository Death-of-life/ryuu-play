import {
  ChooseCardsPrompt,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  ShowCardsPrompt,
  SlotType,
  Simulator,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

import { Arven } from '../../../src/standard/set_g/arven';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

class DummyTrainer extends TrainerCard {
  public set: string = 'TEST';

  public name: string;

  public fullName: string;

  public text: string = '';

  constructor(name: string, trainerType: TrainerType) {
    super();
    this.name = name;
    this.fullName = `${name} TEST`;
    this.trainerType = trainerType;
  }
}

describe('Arven set_g', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts an Item and a Pokemon Tool into hand', () => {
    const arven = new Arven();
    const item = new DummyTrainer('Item Card', TrainerType.ITEM);
    const tool = new DummyTrainer('Tool Card', TrainerType.TOOL);
    const filler = new TestCard();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [arven];
    player.deck.cards = [item, tool, filler];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const itemPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(itemPrompt.id, [item]));
    }).not.toThrow();

    const toolPrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(toolPrompt.id, [tool]));
    }).not.toThrow();

    const showPrompt = TestUtils.getLastPrompt(sim) as ShowCardsPrompt;
    expect(showPrompt).toBeTruthy();
    expect(() => {
      sim.dispatch(new ResolvePromptAction(showPrompt.id, true));
    }).not.toThrow();

    expect(player.hand.cards).toContain(item);
    expect(player.hand.cards).toContain(tool);
    expect(player.supporter.cards).toContain(arven);
    expect(player.deck.cards).toContain(filler);
    expect(player.deck.cards).not.toContain(item);
    expect(player.deck.cards).not.toContain(tool);
  });

  it('can be played with no valid cards in deck', () => {
    const arven = new Arven();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [arven];
    player.deck.cards = [];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    expect(player.supporter.cards).toContain(arven);
    expect(player.hand.cards).not.toContain(arven);
    expect(player.deck.cards.length).toEqual(0);
  });
});
