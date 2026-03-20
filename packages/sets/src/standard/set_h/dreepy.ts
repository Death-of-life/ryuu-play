import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Dreepy extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 17534,
      name: '多龙梅西亚',
      yorenCode: 'P885',
      cardType: '1',
      commodityCode: 'CSV8C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '157/207',
      },
      image: 'img/458/430.png',
      hash: '2827692f5c5a3b7c3067bb2ee381ff9a',
    },
    collection: {
      id: 458,
      commodityCode: 'CSV8C',
      name: '补充包 璀璨诡幻',
      salesDate: '2026-03-13',
    },
    image_url: 'https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/img/458/430.png',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DRAGON];

  public hp: number = 70;

  public weakness = [];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Little Grudge',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: '',
    },
    {
      name: 'Bite',
      cost: [CardType.FIRE, CardType.PSYCHIC],
      damage: '40',
      text: '',
    },
  ];

  public set: string = 'set_h';

  public name: string = 'Dreepy';

  public fullName: string = 'Dreepy CSV8C';
}
