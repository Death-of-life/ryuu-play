import {
  AttackAction,
  CardType,
  PlayerType,
  PutDamagePrompt,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { DragapultEx } from '../../../src/standard/set_h/dragapult-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Dragapult ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('places 6 damage counters on opponent Benched Pokemon with 幻影潜袭', () => {
    const dragapultEx = new DragapultEx();
    const benchedPokemon = new TestPokemon();

    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0].pokemons.cards = [benchedPokemon];

    TestUtils.setActive(sim, [dragapultEx], [CardType.FIRE, CardType.PSYCHIC]);

    sim.dispatch(new AttackAction(1, '幻影潜袭'));

    const putDamagePrompt = TestUtils.getLastPrompt(sim) as PutDamagePrompt;
    expect(putDamagePrompt).toBeTruthy();

    expect(() => {
      sim.dispatch(
        new ResolvePromptAction(putDamagePrompt.id, [
          {
            target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
            damage: 60,
          },
        ])
      );
    }).not.toThrow();

    expect(opponent.active.damage).toEqual(200);
    expect(opponent.bench[0].damage).toEqual(60);
  });
});
