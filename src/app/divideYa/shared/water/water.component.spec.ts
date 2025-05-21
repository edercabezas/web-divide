import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterComponent } from './water.component';

describe('WatherComponent', () => {
  let component: WatherComponent;
  let fixture: ComponentFixture<WatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
