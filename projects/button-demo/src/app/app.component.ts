import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isDisabled = false;

  public onClick(text: string): void {
    console.log('clicked', text);
  }
}
