import {
  CardType,
  CheckProvidedEnergyEffect,
  Simulator,
} from '@ptcg/common';

import { DoubleColorlessEnergy } from '../../../src/standard/set-black-and-white-2/double-colorless-energy';
import { LegacyEnergy } from '../../../src/standard/set_h/legacy-energy';
import { TempleOfSinnoh } from '../../../src/standard/set-sword-and-shield/temple-of-sinnoh';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestUtils } from '../../test-utils';

describe('Temple of Sinnoh set-sword-and-shield', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('makes Special Energy provide exactly 1 Colorless Energy', () => {
    const temple = new TempleOfSinnoh();
    const specialEnergy = new DoubleColorlessEnergy();
    const { state, player } = TestUtils.getAll(sim);

    player.stadium.cards = [temple];
    player.active.energies.cards = [specialEnergy];

    const effect = new CheckProvidedEnergyEffect(player);
    sim.store.reduceEffect(state, effect);

    expect(effect.energyMap.length).toBe(1);
    expect(effect.energyMap[0].provides).toEqual([CardType.COLORLESS]);
  });

  it('overrides Special Energy self effects but keeps Basic Energy unchanged', () => {
    const temple = new TempleOfSinnoh();
    const legacyEnergy = new LegacyEnergy();
    const basicEnergy = new TestEnergy(CardType.WATER);
    const { state, player } = TestUtils.getAll(sim);

    player.stadium.cards = [temple];
    player.active.energies.cards = [legacyEnergy, basicEnergy];

    const effect = new CheckProvidedEnergyEffect(player);
    sim.store.reduceEffect(state, effect);

    const legacyMap = effect.energyMap.find(item => item.card === legacyEnergy);
    const basicMap = effect.energyMap.find(item => item.card === basicEnergy);

    expect(legacyMap?.provides).toEqual([CardType.COLORLESS]);
    expect(basicMap?.provides).toEqual([CardType.WATER]);
  });
});
