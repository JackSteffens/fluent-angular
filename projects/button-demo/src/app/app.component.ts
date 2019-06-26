import {Component, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isDisabled = false;
  public isRevealEnabled = true;
  public mainColor = '';
  public colorTint = 'light-2';
  public buttonCount = 10;
  public buttonList = Array(this.buttonCount);

  public onClick(text: string): void {
    console.log('clicked', text);
  }

  onButtonCountChange(): void {
    this.buttonList = Array(this.buttonCount);
  }
}
