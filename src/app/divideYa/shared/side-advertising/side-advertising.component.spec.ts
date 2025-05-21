import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideAdvertisingComponent } from './side-advertising.component';

describe('SideAdvertisingComponent', () => {
  let component: SideAdvertisingComponent;
  let fixture: ComponentFixture<SideAdvertisingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideAdvertisingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideAdvertisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
