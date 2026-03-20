import {
  ChoosePokemonPrompt,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  SlotType,
  Simulator,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

import { ProfessorTurosScenario } from '../../../src/standard/set_g/professor-turos-scenario';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

class DummyPokemonTool extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'TEST';

  public name: string = 'Dummy Tool';

  public fullName: string = 'Dummy Tool TEST';

  public text: string = '';
}

describe('Professor Turo\'s Scenario set_g', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('returns all Pokemon cards in the stack to hand and discards attached non-Pokemon cards', () => {
    const turo = new ProfessorTurosScenario();
    const basic = new TestPokemon();
    const evolved = new TestPokemon();
    const attachedTool = new DummyPokemonTool();
    const attachedEnergy = new TestEnergy();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [turo];
    player.bench[0].pokemons.cards = [basic, evolved];
    player.bench[0].trainers.cards = [attachedTool];
    player.bench[0].energies.cards = [attachedEnergy];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const prompt = TestUtils.getLastPrompt(sim) as ChoosePokemonPrompt;
    expect(prompt).toBeTruthy();
    expect(() => {
      sim.dispatch(new ResolvePromptAction(prompt.id, [player.bench[0]]));
    }).not.toThrow();

    expect(player.hand.cards).toContain(basic);
    expect(player.hand.cards).toContain(evolved);
    expect(player.supporter.cards).toContain(turo);
    expect(player.discard.cards).toContain(attachedTool);
    expect(player.discard.cards).toContain(attachedEnergy);
    expect(player.bench[0].pokemons.cards.length).toEqual(0);
    expect(player.bench[0].trainers.cards.length).toEqual(0);
    expect(player.bench[0].energies.cards.length).toEqual(0);
  });
});
