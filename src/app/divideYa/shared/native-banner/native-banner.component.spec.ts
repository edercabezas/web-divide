import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeBannerComponent } from './native-banner.component';

describe('NativeBannerComponent', () => {
  let component: NativeBannerComponent;
  let fixture: ComponentFixture<NativeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NativeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
