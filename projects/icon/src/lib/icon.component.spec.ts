import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluentIconComponent } from './fluent-icon.component';

describe('FluentIconComponent', () => {
  let component: FluentIconComponent;
  let fixture: ComponentFixture<FluentIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluentIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluentIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
