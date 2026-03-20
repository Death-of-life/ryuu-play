import {
  ChooseCardsPrompt,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Leon } from '../../../src/standard/set-sword-and-shield/leon';
import { LumineonV } from '../../../src/standard/set-sword-and-shield/lumineon-v';
import { TestCard } from '../../test-cards/test-card';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Lumineon V set-sword-and-shield', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('searches a Supporter when played from hand onto the Bench', () => {
    const lumineonV = new LumineonV();
    const leon = new Leon();
    const filler = new TestCard();

    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.hand.cards = [lumineonV];
    player.deck.cards = [filler, leon];

    sim.dispatch(new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }));

    const prompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    sim.dispatch(new ResolvePromptAction(prompt.id, [leon]));

    expect(player.bench[0].getPokemonCard()).toBe(lumineonV);
    expect(player.hand.cards).toContain(leon);
  });
});
