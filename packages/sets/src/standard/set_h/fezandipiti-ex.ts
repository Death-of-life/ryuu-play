import {
  AttackEffect,
  CardTag,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  GamePhase,
  KnockOutEffect,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class FezandipitiEx extends PokemonCard {
  public rawData = {
    raw_card: {
      id: 17512,
      name: '吉雉鸡ex',
      yorenCode: 'Y1455',
      cardType: '1',
      commodityCode: 'CSV8C',
      details: {
        regulationMarkText: 'H',
        collectionNumber: '135/207',
      },
      image: 'img/458/372.png',
      hash: '4eb1f4487234222de0a13f6837d9553d',
    },
    collection: {
      id: 458,
      commodityCode: 'CSV8C',
      name: '补充包 璀璨诡幻',
      salesDate: '2026-03-13',
    },
    image_url: 'https://raw.githubusercontent.com/duanxr/PTCG-CHS-Datasets/main/img/458/372.png',
  };

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Flip the Script',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'You can use this Ability only if any of your Pokemon were Knocked Out during your opponent\'s last turn. ' +
        'Draw 3 cards. You can\'t use more than 1 Flip the Script Ability each turn.',
    },
  ];

  public attacks = [
    {
      name: 'Cruel Arrow',
      cost: [CardType.DARK, CardType.DARK, CardType.DARK],
      damage: '',
      text: 'This attack does 100 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)',
    },
  ];

  public set: string = 'set_h';

  public name: string = 'Fezandipiti ex';

  public fullName: string = 'Fezandipiti ex CSV8C';

  public readonly FLIP_THE_SCRIPT_MARKER = 'FLIP_THE_SCRIPT_MARKER';
  public readonly KNOCKED_OUT_LAST_TURN_MARKER = 'KNOCKED_OUT_LAST_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (!player.marker.hasMarker(this.KNOCKED_OUT_LAST_TURN_MARKER)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.FLIP_THE_SCRIPT_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveTo(player.hand, Math.min(3, player.deck.cards.length));
      player.marker.addMarker(this.FLIP_THE_SCRIPT_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
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

          const damageEffect = new PutDamageEffect(effect, 100);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.KNOCKED_OUT_LAST_TURN_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.FLIP_THE_SCRIPT_MARKER);
      effect.player.marker.removeMarker(this.KNOCKED_OUT_LAST_TURN_MARKER);
      return state;
    }

    return state;
  }
}
