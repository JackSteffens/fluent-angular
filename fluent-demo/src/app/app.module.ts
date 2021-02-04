import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {FluentButtonModule} from '../../../components/button/src/lib/button.module';
import {FluentIconModule} from '../../../components/icon/src/lib/icon.module';
import {FluentRevealModule} from '../../../components/reveal/src/lib/reveal.module';
import {FluentCheckBoxModule} from '../../../components/check-box/src/lib/check-box.module';

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
