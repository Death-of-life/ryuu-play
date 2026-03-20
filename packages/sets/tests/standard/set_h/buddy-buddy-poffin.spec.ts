import {
  CardType,
  ChooseCardsPrompt,
  PlayCardAction,
  PlayerType,
  PokemonCard,
  ResolvePromptAction,
  Simulator,
  SlotType,
  Stage,
} from '@ptcg/common';

import { BuddyBuddyPoffin } from '../../../src/standard/set_h/buddy-buddy-poffin';
import { TestUtils } from '../../test-utils';

class DummyBasicPokemon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number;

  public weakness = [];

  public retreat = [];

  public set: string = 'TEST';

  public name: string;

  public fullName: string;

  constructor(name: string, hp: number) {
    super();
    this.name = name;
    this.hp = hp;
    this.fullName = `${name} TEST`;
  }
}

describe('Buddy-Buddy Poffin set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('puts up to 2 Basic Pokemon with 70 HP or less onto the Bench', () => {
    const poffin = new BuddyBuddyPoffin();
    const eligibleA = new DummyBasicPokemon('Eligible A', 60);
    const ineligible = new DummyBasicPokemon('Ineligible', 80);
    const eligibleB = new DummyBasicPokemon('Eligible B', 70);

    const { player } = TestUtils.getAll(sim);
    player.hand.cards = [poffin];
    player.deck.cards = [eligibleA, ineligible, eligibleB];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    const choosePrompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(() => {
      sim.dispatch(new ResolvePromptAction(choosePrompt.id, [eligibleA, eligibleB]));
    }).not.toThrow();

    expect(player.bench[0].pokemons.cards).toEqual([eligibleA]);
    expect(player.bench[1].pokemons.cards).toEqual([eligibleB]);
    expect(player.deck.cards).toContain(ineligible);
    expect(player.discard.cards).toContain(poffin);
  });
});
