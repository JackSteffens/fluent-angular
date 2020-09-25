import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluentIcon } from './icon.component';

describe('FluentIconComponent', () => {
  let component: FluentIcon;
  let fixture: ComponentFixture<FluentIcon>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FluentIcon]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FluentIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
