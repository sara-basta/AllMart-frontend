import { TestBed } from '@angular/core/testing';

import { CheckoutFlow } from './checkout-flow';

describe('CheckoutFlow', () => {
  let service: CheckoutFlow;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutFlow);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
