import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionAdvertisementComponent } from './option-advertisement.component';

describe('OptionAdvertisementComponent', () => {
  let component: OptionAdvertisementComponent;
  let fixture: ComponentFixture<OptionAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionAdvertisementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
