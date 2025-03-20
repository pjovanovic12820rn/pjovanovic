import { TestBed } from '@angular/core/testing';

import { PayeeService } from './payee.service';

// @ts-ignore
describe('PayeeService', () => {
  let service: PayeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
