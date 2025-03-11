import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchageRateCalculatorComponent } from './exchage-rate-calculator.component';

describe('ExchageRateCalculatorComponent', () => {
  let component: ExchageRateCalculatorComponent;
  let fixture: ComponentFixture<ExchageRateCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchageRateCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchageRateCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
