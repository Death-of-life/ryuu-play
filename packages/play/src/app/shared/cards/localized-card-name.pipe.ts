import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '@ptcg/common';

import { DisplayTextService } from '../i18n/display-text.service';

@Pipe({
  name: 'localizedCardName',
  pure: false
})
export class LocalizedCardNamePipe implements PipeTransform {

  constructor(private displayTextService: DisplayTextService) { }

  public transform(card: Card | string | null | undefined, fallback: 'name' | 'fullName' = 'name'): string {
    return this.displayTextService.getCardDisplayName(card, fallback);
  }

}
