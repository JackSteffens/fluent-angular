import {Attribute, Component} from '@angular/core';
// FIXME Not sure if this is the best way to import json performance wise
import * as nameList from './icon.json';

@Component({
  selector: 'i[fluent-icon], i[fluent-icon-name]',
  template: `{{glyph}}`,
  styleUrls: ['./icon.scss']
})
export class FluentIcon {
  public glyph: string;

  constructor(@Attribute('fluent-icon') hex: string, @Attribute('fluent-icon-name') glyphName: string) {
    this.glyph = hex;

    if (glyphName && glyphName !== '') {
      const glyphHex: string = nameList['default'][glyphName];
      const num: number = parseInt(glyphHex, 16);
      this.glyph = String.fromCharCode(num);
    }
  }
}
