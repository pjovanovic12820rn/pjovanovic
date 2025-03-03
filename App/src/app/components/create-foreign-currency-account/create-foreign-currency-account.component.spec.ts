import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForeignCurrencyAccountComponent } from './create-foreign-currency-account.component';

describe('CreateForeignCurrencyAccountComponent', () => {
  let component: CreateForeignCurrencyAccountComponent;
  let fixture: ComponentFixture<CreateForeignCurrencyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateForeignCurrencyAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateForeignCurrencyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
