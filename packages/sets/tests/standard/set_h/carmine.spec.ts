import {
  PlayCardAction,
  PlayerType,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Iono } from '../../../src/standard/set_g/iono';
import { Carmine } from '../../../src/standard/set_h/carmine';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

describe('Carmine set_h', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
  });

  it('can be played on the first turn and discards hand to draw 5 cards', () => {
    const carmine = new Carmine();
    const handA = new TestCard();
    const handB = new TestCard();

    const deckA = new TestCard();
    const deckB = new TestCard();
    const deckC = new TestCard();
    const deckD = new TestCard();
    const deckE = new TestCard();
    const deckF = new TestCard();

    const { state, player } = TestUtils.getAll(sim);
    state.turn = 1;
    state.rules.firstTurnUseSupporter = false;

    player.hand.cards = [carmine, handA, handB];
    player.deck.cards = [deckA, deckB, deckC, deckD, deckE, deckF];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).not.toThrow();

    expect(player.discard.cards).toContain(handA);
    expect(player.discard.cards).toContain(handB);
    expect(player.hand.cards).toEqual([deckA, deckB, deckC, deckD, deckE]);
    expect(player.deck.cards).toEqual([deckF]);
  });

  it('keeps the first-turn supporter restriction for regular supporters', () => {
    const iono = new Iono();
    const { state, player } = TestUtils.getAll(sim);

    state.turn = 1;
    state.rules.firstTurnUseSupporter = false;
    player.hand.cards = [iono];

    expect(() => {
      sim.dispatch(
        new PlayCardAction(1, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.HAND, index: 0 })
      );
    }).toThrow();

    expect(player.hand.cards).toEqual([iono]);
    expect(player.supporter.cards).toEqual([]);
  });
});
