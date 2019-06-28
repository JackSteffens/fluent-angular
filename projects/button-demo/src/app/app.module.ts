import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {FluentButtonModule} from '../../../button/src/lib/button.module';
import {FluentIconModule} from '../../../icon/src/lib/icon.module';
import {FluentRevealModule} from '../../../reveal/src/lib/reveal.module';
import {FluentCheckBoxModule} from '../../../check-box/src/lib/check-box.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FluentButtonModule,
    FluentIconModule,
    FluentRevealModule,
    FluentCheckBoxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
