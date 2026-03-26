import { AttackEffect, CardType, PokemonCard, Stage } from '@ptcg/common';

import { HearthflameMaskOgerponEx } from '../../../src/standard/set_h/hearthflame-mask-ogerpon-ex';
import { TestUtils } from '../../test-utils';

class DummyPokemon extends PokemonCard {
  public stage: Stage;
  public cardTypes: CardType[];
  public hp: number;
  public weakness = [];
  public resistance = [];
  public retreat = [];
  public set = 'TEST';
  public name = 'Dummy';
  public fullName = 'Dummy TEST';
  public evolvesFrom = '';
  public attacks = [];
  public powers = [];

  constructor(stage: Stage, cardTypes: CardType[] = [], hp = 120) {
    super();
    this.stage = stage;
    this.cardTypes = cardTypes;
    this.hp = hp;
  }
}

describe('HearthflameMaskOgerponEx set_h', () => {
  it('scales 愤怒火灶 by damage counters on itself', () => {
    const sim = TestUtils.createTestSimulator();
    const card = new HearthflameMaskOgerponEx();
    const { state, player, opponent } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [card], [CardType.FIRE]);
    player.active.damage = 40;
    TestUtils.setDefending(sim, [new DummyPokemon(Stage.BASIC)]);

    const effect = new AttackEffect(player, opponent, card.attacks[0]);
    card.reduceEffect(sim.store, state, effect);

    expect(effect.damage).toBe(80);
  });

  it('adds damage and discards all Energy for 强劲烈焰 when the defending Pokémon is evolved', () => {
    const sim = TestUtils.createTestSimulator();
    const card = new HearthflameMaskOgerponEx();
    const fireA = TestUtils.makeEnergies([CardType.FIRE])[0];
    const fireB = TestUtils.makeEnergies([CardType.FIRE])[0];
    const fireC = TestUtils.makeEnergies([CardType.FIRE])[0];
    const evolved = new DummyPokemon(Stage.STAGE_1, [CardType.GRASS]);

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [card], [CardType.FIRE, CardType.FIRE, CardType.FIRE]);
    player.active.energies.cards = [fireA, fireB, fireC];
    opponent.active.pokemons.cards = [evolved];

    const effect = new AttackEffect(player, opponent, card.attacks[1]);
    card.reduceEffect(sim.store, sim.store.state, effect);

    expect(effect.damage).toBe(280);
    expect(player.active.energies.cards.length).toBe(0);
    expect(player.discard.cards).toEqual(jasmine.arrayContaining([fireA, fireB, fireC]));
  });
});
