import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCreationModalComponent } from './order-creation-modal.component';

describe('OrderCreationModalComponent', () => {
  let component: OrderCreationModalComponent;
  let fixture: ComponentFixture<OrderCreationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCreationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
