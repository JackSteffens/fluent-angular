import { TestBed } from '@angular/core/testing';

import { IconService } from './fluent-icon.service';

describe('FluentIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconService = TestBed.get(IconService);
    expect(service).toBeTruthy();
  });
});
