import {Attribute, Component} from '@angular/core';
import {Icon} from './icon';

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
      const glyphHex: string = Icon[glyphName];
      const num: number = parseInt(glyphHex, 16);
      this.glyph = String.fromCharCode(num);
    }
  }
}
