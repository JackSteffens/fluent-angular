import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluentCheckBox } from './check-box.component';

describe('CheckBoxComponent', () => {
  let component: FluentCheckBox;
  let fixture: ComponentFixture<FluentCheckBox>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FluentCheckBox]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FluentCheckBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
