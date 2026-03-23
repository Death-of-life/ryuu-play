import { Card } from '../card/card';
import { CardManager } from '../../game/cards/card-manager';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';

export class CardList<T extends Card = Card> {

  public cards: T[] = [];

  public isPublic: boolean = false;

  public isSecret: boolean = false;

  private discardPile?: CardList;

  private lostZone?: CardList;

  public setDefaultZones(discardPile: CardList, lostZone: CardList): void {
    this.discardPile = discardPile;
    this.lostZone = lostZone;
  }

  public static fromList(names: string[]): CardList {
    const cardList = new CardList();
    const cardManager = CardManager.getInstance();
    cardList.cards = names.map(cardName => {
      const card = cardManager.getCardByName(cardName);
      if (card === undefined) {
        throw new GameError(GameMessage.UNKNOWN_CARD, cardName);
      }
      return card;
    });
    return cardList;
  }

  public applyOrder(order: number[]) {
    // Check if order is valid, same length
    if (this.cards.length !== order.length) {
      return;
    }
    // Contains all elements exacly one time
    const orderCopy = order.slice();
    orderCopy.sort((a, b) => a - b);
    for (let i = 0; i < orderCopy.length; i++) {
      if (i !== orderCopy[i]) {
        return;
      }
    }
    // Apply order
    const copy = this.cards.slice();
    for (let i = 0; i < order.length; i++) {
      this.cards[i] = copy[order[i]];
    }
  }

  public moveTo(destination: CardList, count?: number): void {
    if (count === undefined) {
      count = this.cards.length;
    }

    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.push(...cards);
  }

  public moveCardsTo(cards: T[], destination: CardList): void {
    for (let i = 0; i < cards.length; i++) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        destination.cards.push(card[0]);
      }
    }
  }

  public moveCardTo(card: T, destination: CardList): void {
    this.moveCardsTo([card], destination);
  }

  public discard(cards: T[] | T, discardPile?: CardList): void {
    const cardsToDiscard = cards instanceof Array ? cards : [cards];
    const target = discardPile ?? this.discardPile;
    if (target === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    this.moveCardsTo(cardsToDiscard, target);
  }

  public toLostZone(cards: T[] | T, lostZone?: CardList): void {
    const cardsToMove = cards instanceof Array ? cards : [cards];
    const target = lostZone ?? this.lostZone;
    if (target === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    this.moveCardsTo(cardsToMove, target);
  }

  public moveToBottom(destination: CardList, count?: number): void {
    if (count === undefined) {
      count = this.cards.length;
    }

    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.push(...CardList.shuffle(cards));
  }

  public moveCardsToBottom(cards: T[], destination: CardList): void {
    const movedCards: T[] = [];
    for (let i = 0; i < cards.length; i++) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        movedCards.push(card[0]);
      }
    }

    destination.cards.push(...CardList.shuffle(movedCards));
  }

  public moveCardToBottom(card: T, destination: CardList): void {
    this.moveCardTo(card, destination);
  }

  private static shuffle<K>(cards: K[]): K[] {
    const shuffled = cards.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const tmp = shuffled[i];
      shuffled[i] = shuffled[randomIndex];
      shuffled[randomIndex] = tmp;
    }
    return shuffled;
  }

  public moveToTop(destination: CardList, count?: number): void {
    if (count === undefined) {
      count = this.cards.length;
    }

    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.unshift(...cards);
  }

  public moveCardsToTop(cards: T[], destination: CardList): void {
    for (let i = cards.length - 1; i >= 0; i--) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        destination.cards.unshift(card[0]);
      }
    }
  }

  public moveCardToTop(card: T, destination: CardList): void {
    this.moveCardsTo([card], destination);
  }

  public top(count: number = 1): T[] {
    count = Math.min(count, this.cards.length);
    return this.cards.slice(0, count);
  }

}
