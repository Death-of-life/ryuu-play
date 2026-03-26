import { CardTag, Stage, SuperType } from '@ptcg/common';

import { simpleHCards } from '../../../src/standard/set_h/simple-generated';

describe('simple-generated set_h', () => {
  it('contains simple H pokemon with Chinese display fields', () => {
    expect(simpleHCards.length).toBe(23);
    expect(simpleHCards.every(card => card.superType === SuperType.POKEMON)).toBe(true);

    const torchic = simpleHCards.find(card => card.name === '火稚鸡');
    const darkraiEx = simpleHCards.find(card => card.name === '达克莱伊ex');
    const bubble = simpleHCards.find(card => card.name === '泡沫栗鼠');
    const chinchilla = simpleHCards.find(card => card.name === '奇诺栗鼠');

    expect(torchic).toBeDefined();
    expect(torchic!.fullName).toContain('火稚鸡');
    expect(darkraiEx).toBeDefined();
    expect(darkraiEx!.tags).toContain(CardTag.POKEMON_EX);
    expect(bubble).toBeDefined();
    expect((bubble as any).stage).toBe(Stage.BASIC);
    expect(bubble!.fullName).toBe('泡沫栗鼠 CSV7C');
    expect(chinchilla).toBeDefined();
    expect((chinchilla as any).stage).toBe(Stage.STAGE_1);
    expect(chinchilla!.fullName).toBe('奇诺栗鼠 CSV7C');
  });
});
