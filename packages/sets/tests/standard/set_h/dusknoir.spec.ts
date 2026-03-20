import {
  ChoosePokemonPrompt,
  ChoosePrizePrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { DragapultEx } from '../../../src/standard/set_h/dragapult-ex';
import { Dusknoir } from '../../../src/standard/set_h/dusknoir';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Dusknoir set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('uses Cursed Blast to place 13 damage counters and Knock Out itself', () => {
    const dusknoir = new Dusknoir();
    const target = new DragapultEx();

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0].pokemons.cards = [dusknoir];
    opponent.bench[0].pokemons.cards = [target];

    sim.dispatch(new UseAbilityAction(1, 'Cursed Blast', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    expect(choosePrompt).toBeTruthy();

    sim.dispatch(new ResolvePromptAction(choosePrompt.id, [opponent.bench[0]]));

    expect(opponent.bench[0].damage).toEqual(130);
    expect(player.bench[0].pokemons.cards.length).toEqual(0);
    expect(player.discard.cards).toContain(dusknoir);

    const prizePrompt = TestUtils.getLastPrompt(sim) as ChoosePrizePrompt;
    expect(prizePrompt).toBeTruthy();
    expect(prizePrompt.type).toEqual('Choose prize');

    const prize = opponent.prizes.find(p => p.cards.length > 0);
    sim.dispatch(new ResolvePromptAction(prizePrompt.id, prize ? [prize] : []));
    expect(opponent.hand.cards.length).toEqual(1);
  });
});
