import {
  CardType,
  ChooseCardsPrompt,
  EnergyCard,
  EnergyType,
  PlayCardAction,
  PlayerType,
  PokemonCard,
  ResolvePromptAction,
  ShowCardsPrompt,
  Simulator,
  SlotType,
  Stage,
} from '@ptcg/common';

import { NightStretcher } from '../../../src/standard/set_h/night-stretcher';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

class DummyBasicPokemon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public weakness = [];

  public retreat = [];

  public set: string = 'TEST';

  public name: string = 'Dummy Basic Pokemon';

  public fullName: string = 'Dummy Basic Pokemon TEST';
}

class DummyBasicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.GRASS];

  public energyType: EnergyType = EnergyType.BASIC;

  public set: string = 'TEST';

  public name: string = 'Dummy Basic Energy';

  public fullName: string = 'Dummy Basic Energy TEST';
}

describe('Night Stretcher set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts a Pokemon from discard pile into hand and reveals it', () => {
    const nightStretcher = new NightStretcher();
    const pokemon = new DummyBasicPokemon();
    const energy = new DummyBasicEnergy();
    const filler = new TestCard();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [nightStretcher];
    player.discard.cards = [pokemon, energy, filler];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(choosePrompt.id, [pokemon]));
    }).not.toThrow();

    const showPrompt = TestUtils.getLastPrompt(sim) as ShowCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(showPrompt.id, true));
    }).not.toThrow();

    expect(player.hand.cards).toContain(pokemon);
    expect(player.discard.cards).toContain(nightStretcher);
    expect(player.discard.cards).toContain(energy);
    expect(player.discard.cards).toContain(filler);
  });

  it('puts a Basic Energy card from discard pile into hand', () => {
    const nightStretcher = new NightStretcher();
    const pokemon = new DummyBasicPokemon();
    const energy = new DummyBasicEnergy();

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [nightStretcher];
    player.discard.cards = [pokemon, energy];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(choosePrompt.id, [energy]));
    }).not.toThrow();

    const showPrompt = TestUtils.getLastPrompt(sim) as ShowCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(showPrompt.id, true));
    }).not.toThrow();

    expect(player.hand.cards).toContain(energy);
    expect(player.discard.cards).toContain(nightStretcher);
    expect(player.discard.cards).toContain(pokemon);
  });
});
