import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoBackButton } from './go-back-button';

describe('GoBackButton', () => {
  let component: GoBackButton;
  let fixture: ComponentFixture<GoBackButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoBackButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoBackButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
