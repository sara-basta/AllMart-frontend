import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressManager } from './address-manager';

describe('AddressManager', () => {
  let component: AddressManager;
  let fixture: ComponentFixture<AddressManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
