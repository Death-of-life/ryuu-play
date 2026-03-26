import {
  ChoosePokemonPrompt,
  ChoosePrizePrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { Dusclops } from '../../../src/standard/set_h/dusclops';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Dusclops set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('uses 咒怨炸弹 to place 5 damage counters, Knock Out itself, and give a Prize', () => {
    const dusclops = new Dusclops();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0].pokemons.cards = [dusclops];

    sim.dispatch(new UseAbilityAction(1, '咒怨炸弹', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    expect(choosePrompt).toBeTruthy();

    sim.dispatch(new ResolvePromptAction(choosePrompt.id, [opponent.active]));

    expect(opponent.active.damage).toEqual(50);
    expect(player.bench[0].pokemons.cards.length).toEqual(0);
    expect(player.discard.cards).toContain(dusclops);

    const prizePrompt = TestUtils.getLastPrompt(sim) as ChoosePrizePrompt;
    expect(prizePrompt).toBeTruthy();
    expect(prizePrompt.type).toEqual('Choose prize');

    const prize = opponent.prizes.find(p => p.cards.length > 0);
    sim.dispatch(new ResolvePromptAction(prizePrompt.id, prize ? [prize] : []));
    expect(opponent.hand.cards.length).toEqual(1);
  });
});
