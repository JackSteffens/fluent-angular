import { TestBed } from '@angular/core/testing';

import { IconService } from './icon.service';

describe('FluentIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconService = TestBed.inject(IconService);
    expect(service).toBeTruthy();
  });
});
