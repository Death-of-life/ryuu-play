import { Pipe, PipeTransform } from '@angular/core';

import { DisplayTextService } from '../i18n/display-text.service';

@Pipe({
  name: 'localizedFormatName',
  pure: false
})
export class LocalizedFormatNamePipe implements PipeTransform {

  constructor(private displayTextService: DisplayTextService) { }

  public transform(formatName: string | null | undefined): string {
    return this.displayTextService.getFormatName(formatName);
  }

}
