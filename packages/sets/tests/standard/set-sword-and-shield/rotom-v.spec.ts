import {
  AttackAction,
  CardType,
  ChooseCardsPrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { Eviolite } from '../../../src/standard/set-diamond-and-pearl/eviolite';
import { RotomV } from '../../../src/standard/set-sword-and-shield/rotom-v';
import { TestCard } from '../../test-cards/test-card';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Rotom V set-sword-and-shield', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('uses Instant Charge once per turn, then ends the turn', () => {
    const rotomV = new RotomV();
    const topA = new TestCard();
    const topB = new TestCard();
    const topC = new TestCard();
    const topD = new TestCard();

    const { player, state } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0].pokemons.cards = [rotomV];
    player.deck.cards = [topA, topB, topC, topD];

    sim.dispatch(new UseAbilityAction(1, 'Instant Charge', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    expect(player.hand.cards).toEqual([topA, topB, topC]);
    expect(state.activePlayer).toEqual(1);

    expect(() => {
      sim.dispatch(new UseAbilityAction(1, 'Instant Charge', {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.BENCH,
        index: 0,
      }));
    }).toThrow();
  });

  it('adds 40 damage for each Pokemon Tool moved from discard by Scrap Short', () => {
    const rotomV = new RotomV();
    const toolA = new Eviolite();
    const filler = new TestCard();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [rotomV], [CardType.LIGHTNING, CardType.COLORLESS]);
    player.discard.cards = [toolA, filler];

    sim.dispatch(new AttackAction(1, 'Scrap Short'));

    const prompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toBeTruthy();
    sim.dispatch(new ResolvePromptAction(prompt.id, [toolA]));

    expect(opponent.active.damage).toEqual(80);
    expect(player.discard.cards).not.toContain(toolA);
    expect(player.lostzone.cards).toContain(toolA);
    expect(player.discard.cards).toContain(filler);
  });
});
