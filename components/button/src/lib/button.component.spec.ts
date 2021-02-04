import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluentButton } from './button.component';

describe('ButtonComponent', () => {
  let component: FluentButton;
  let fixture: ComponentFixture<FluentButton>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FluentButton]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FluentButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
