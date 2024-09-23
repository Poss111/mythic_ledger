import { TestBed } from '@angular/core/testing';

import { MythicLedgerService } from './mythic-ledger-service.service';

describe('MythicLedgerService', () => {
  let service: MythicLedgerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MythicLedgerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
