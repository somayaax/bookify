import { TestBed } from '@angular/core/testing';

import { CBAService } from './cba.service';

describe('CBAService', () => {
  let service: CBAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CBAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
