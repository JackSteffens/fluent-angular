import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isDisabled = true;
  public list = [1, 2, 3];

  public onClick(text: string): void {
    console.log('clicked', text);
  }
}
