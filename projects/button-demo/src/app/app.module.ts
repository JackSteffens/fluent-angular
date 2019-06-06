import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FluentButtonModule} from '../../../button/src/lib/button.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FluentButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
