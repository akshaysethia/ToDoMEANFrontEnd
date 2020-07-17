import { TestBed } from '@angular/core/testing';

import { ErrorprocessorService } from './errorprocessor.service';

describe('ErrorprocessorService', () => {
  let service: ErrorprocessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorprocessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
