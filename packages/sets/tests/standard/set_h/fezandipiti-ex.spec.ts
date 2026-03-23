import {
  AttackAction,
  CardType,
  ChoosePokemonPrompt,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  UseAbilityAction,
} from '@ptcg/common';

import { FezandipitiEx } from '../../../src/standard/set_h/fezandipiti-ex';
import { TestCard } from '../../test-cards/test-card';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Fezandipiti ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('draws 3 cards with Flip the Script only once per turn', () => {
    const fezandipitiEx = new FezandipitiEx();
    const topA = new TestCard();
    const topB = new TestCard();
    const topC = new TestCard();
    const topD = new TestCard();

    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0].pokemons.cards = [fezandipitiEx];
    player.hand.cards = [];
    player.deck.cards = [topA, topB, topC, topD];
    player.marker.addMarker(fezandipitiEx.KNOCKED_OUT_LAST_TURN_MARKER, fezandipitiEx);

    sim.dispatch(new UseAbilityAction(1, 'Flip the Script', {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0,
    }));

    expect(player.hand.cards).toEqual([topA, topB, topC]);

    expect(() => {
      sim.dispatch(new UseAbilityAction(1, 'Flip the Script', {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.BENCH,
        index: 0,
      }));
    }).toThrow();
  });

  it('places 100 damage on a chosen opposing Pokemon with Cruel Arrow', () => {
    const fezandipitiEx = new FezandipitiEx();
    const opponentBench = new TestPokemon();

    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [fezandipitiEx], [CardType.DARK, CardType.DARK, CardType.DARK]);
    opponent.bench[0].pokemons.cards = [opponentBench];

    sim.dispatch(new AttackAction(1, 'Cruel Arrow'));

    const prompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    expect(prompt).toBeTruthy();
    sim.dispatch(new ResolvePromptAction(prompt.id, [opponent.bench[0]]));

    expect(opponent.bench[0].damage).toEqual(100);
    expect(opponent.active.damage).toEqual(0);
  });
});
