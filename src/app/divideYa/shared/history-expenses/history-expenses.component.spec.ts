import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryExpensesComponent } from './history-expenses.component';

describe('HistoryExpensesComponent', () => {
  let component: HistoryExpensesComponent;
  let fixture: ComponentFixture<HistoryExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
