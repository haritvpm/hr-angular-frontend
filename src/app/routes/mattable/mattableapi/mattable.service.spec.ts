import { TestBed } from '@angular/core/testing';

import { MattableService } from './mattable.service';

describe('MattableService', () => {
  let service: MattableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MattableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
