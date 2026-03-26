import {
  CardType,
  ChooseCardsPrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { Duskull } from '../../../src/standard/set_h/duskull';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Duskull set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts up to 3 夜巡灵 from discard onto the Bench with 渡魂', () => {
    const onBench = new Duskull();
    const recoveredA = new Duskull();
    const recoveredB = new Duskull();

    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()], [CardType.PSYCHIC]);
    player.bench[0].pokemons.cards = [onBench];
    player.discard.cards = [recoveredA, recoveredB];

    sim.dispatch(new UseAbilityAction(1, '渡魂', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(choosePrompt).toBeTruthy();
    expect(choosePrompt.options.max).toEqual(2);

    sim.dispatch(new ResolvePromptAction(choosePrompt.id, [recoveredA, recoveredB]));

    expect(player.bench[1].pokemons.cards).toEqual([recoveredA]);
    expect(player.bench[2].pokemons.cards).toEqual([recoveredB]);
    expect(player.discard.cards.length).toEqual(0);
  });
});
