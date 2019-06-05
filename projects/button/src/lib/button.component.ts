import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'fluent-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class FluentButton implements OnInit {
  @Input() disabled = false;

  constructor() {
  }

  ngOnInit() {
  }

}
