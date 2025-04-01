import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoanRequestsComponent } from './new-loan-requests.component';

describe('NewLoanRequestsComponent', () => {
  let component: NewLoanRequestsComponent;
  let fixture: ComponentFixture<NewLoanRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoanRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoanRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
