import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Ledyba extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 17380,
      name: '芭瓢虫',
      yorenCode: 'P165',
      cardType: '1',
      commodityCode: 'CSV8C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '003/207',
      },
      image: '/api/v1/cards/17380/image',
    },
    collection: {
      id: 458,
      commodityCode: 'CSV8C',
      name: '补充包 璀璨诡幻',
    },
    image_url: 'http://212.52.0.192:3000/api/v1/cards/17380/image',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '鲁莽头击',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: '',
    },
  ];

  public set: string = 'set_h';

  public name: string = '芭瓢虫';

  public fullName: string = '芭瓢虫 CSV8C';
}
