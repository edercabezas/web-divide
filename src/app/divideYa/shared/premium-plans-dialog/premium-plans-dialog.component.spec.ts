import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPlansDialogComponent } from './premium-plans-dialog.component';

describe('PremiumPlansDialogComponent', () => {
  let component: PremiumPlansDialogComponent;
  let fixture: ComponentFixture<PremiumPlansDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumPlansDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumPlansDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
