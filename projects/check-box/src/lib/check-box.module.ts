import {NgModule} from '@angular/core';
import {FluentCheckBox} from './check-box.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [FluentCheckBox],
  imports: [FormsModule],
  exports: [FluentCheckBox]
})
export class FluentCheckBoxModule {}
