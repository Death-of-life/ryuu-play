import { Component, Inject } from '@angular/core';
import { Card } from '@ptcg/common';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';

import { CardsBaseService } from '../cards-base.service';

export interface CardVariantPickerPopupData {
  cards: Card[];
  selected?: Card;
}

@Component({
  selector: 'ptcg-card-variant-picker-popup',
  templateUrl: './card-variant-picker-popup.component.html',
  styleUrls: ['./card-variant-picker-popup.component.scss']
})
export class CardVariantPickerPopupComponent {

  public cards: Card[];
  public selected: Card;

  constructor(
    private cardsBaseService: CardsBaseService,
    private dialogRef: MatDialogRef<CardVariantPickerPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardVariantPickerPopupData
  ) {
    this.cards = data.cards;
    this.selected = data.selected || data.cards[0];
  }

  public select(card: Card) {
    this.selected = card;
  }

  public addToDeck() {
    this.dialogRef.close(this.selected);
  }

  public close() {
    this.dialogRef.close();
  }

  public getRarityLabel(card: Card): string {
    return this.cardsBaseService.getRarityLabel(card) || '-';
  }

  public getCollectionNumber(card: Card): string {
    return this.cardsBaseService.getCollectionNumber(card);
  }
}
