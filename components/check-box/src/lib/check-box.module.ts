import {NgModule} from '@angular/core';
import {FluentCheckBox} from './check-box.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [FluentCheckBox],
  imports: [FormsModule, CommonModule],
  exports: [FluentCheckBox]
})
export class FluentCheckBoxModule {}
