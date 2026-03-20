import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Dusknoir extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 17589,
      name: '黑夜魔灵',
      yorenCode: 'P477',
      cardType: '1',
      commodityCode: 'CSV8C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '212/207',
      },
      image: 'img/458/563.png',
      hash: '0d0538d1be767bac5c40653a841be206',
    },
    collection: {
      id: 458,
      commodityCode: 'CSV8C',
      name: '补充包 璀璨诡幻',
      salesDate: '2026-03-13',
    },
    image_url: 'https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/img/458/563.png',
  };

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dusclops';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 160;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Cursed Blast',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn, you may Knock Out this Pokemon. If you do, put 13 damage counters on 1 of your opponent\'s Pokemon.',
    },
  ];

  public attacks = [
    {
      name: 'Shadow Bind',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '150',
      text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.',
    },
  ];

  public set: string = 'set_h';

  public name: string = 'Dusknoir';

  public fullName: string = 'Dusknoir CSV8C';

  public readonly CURSED_BLAST_MARKER = 'CURSED_BLAST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return cantRetreat.use(effect);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (player.marker.hasMarker(this.CURSED_BLAST_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (pokemonSlot === undefined || !pokemonSlot.pokemons.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets === null || targets.length === 0) {
            return;
          }

          player.marker.addMarker(this.CURSED_BLAST_MARKER, this);
          targets[0].damage += 130;
          pokemonSlot.damage += 999;
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CURSED_BLAST_MARKER, this);
      return state;
    }

    return state;
  }
}
