import {
  CardType,
  PokemonCard,
  Stage,
} from '@ptcg/common';

export class Lechonk extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 16818,
      name: '爱吃豚',
      yorenCode: 'P0915',
      cardType: '1',
      commodityCode: 'CSVSC',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '047/066',
      },
      image: '/api/v1/cards/16818/image',
    },
    collection: {
      id: 326,
      commodityCode: 'CSVSC',
      name: '对战学院',
    },
    image_url: 'http://212.52.0.192:3000/api/v1/cards/16818/image',
  };

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: '后踢',
      cost: [CardType.COLORLESS],
      damage: '30',
      text: '',
    },
  ];

  public set: string = 'set_h';

  public name: string = '爱吃豚';

  public fullName: string = '爱吃豚 CSVSC';
}
