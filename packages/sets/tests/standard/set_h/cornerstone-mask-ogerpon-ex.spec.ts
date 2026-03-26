import {
  AttackAction,
  AttackEffect,
  CardType,
  PokemonCard,
  PowerType,
  Simulator,
  Stage,
} from '@ptcg/common';

import { CornerstoneMaskOgerponEx } from '../../../src/standard/set_h/cornerstone-mask-ogerpon-ex';
import { TestUtils } from '../../test-utils';

class DummyAttacker extends PokemonCard {
  public stage = Stage.BASIC;
  public cardTypes = [CardType.FIGHTING];
  public hp = 100;
  public weakness = [];
  public resistance = [];
  public retreat = [];
  public set = 'TEST';
  public name = 'Dummy';
  public fullName = 'Dummy TEST';
  public evolvesFrom = '';
  public attacks = [
    {
      name: '测试攻击',
      cost: [CardType.COLORLESS],
      damage: '60',
      text: '',
    },
  ];
  public powers: { name: string; powerType: PowerType; text: string }[] = [];

  constructor(withAbility = false) {
    super();
    if (withAbility) {
      this.powers = [
        {
          name: '测试特性',
          powerType: PowerType.ABILITY,
          text: '',
        },
      ];
    }
  }
}

describe('Cornerstone Mask Ogerpon ex set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('prevents damage from opponent attacks if the attacking Pokémon has an Ability', () => {
    const cornerstoneMaskOgerponEx = new CornerstoneMaskOgerponEx();
    const attacker = new DummyAttacker(true);

    const { player, opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [attacker], [CardType.FIGHTING]);
    TestUtils.setDefending(sim, [cornerstoneMaskOgerponEx]);

    sim.dispatch(new AttackAction(1, '测试攻击'));

    expect(opponent.active.damage).toEqual(0);
    expect(player.active.damage).toEqual(0);
  });

  it('does not block damage from opponent attacks without an Ability', () => {
    const cornerstoneMaskOgerponEx = new CornerstoneMaskOgerponEx();
    const attacker = new DummyAttacker(false);

    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [attacker], [CardType.FIGHTING]);
    TestUtils.setDefending(sim, [cornerstoneMaskOgerponEx]);

    sim.dispatch(new AttackAction(1, '测试攻击'));

    expect(opponent.active.damage).toEqual(60);
  });

  it('ignores weakness and resistance for 打爆', () => {
    const card = new CornerstoneMaskOgerponEx();
    const effect = new AttackEffect(
      TestUtils.getAll(sim).player,
      TestUtils.getAll(sim).opponent,
      card.attacks[0]
    );

    card.reduceEffect(sim.store, sim.store.state, effect);

    expect(effect.damage).toBe(140);
    expect(effect.ignoreWeakness).toBeTrue();
    expect(effect.ignoreResistance).toBeTrue();
  });
});
