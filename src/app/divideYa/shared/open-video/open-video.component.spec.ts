import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenVideoComponent } from './open-video.component';

describe('OpenVideoComponent', () => {
  let component: OpenVideoComponent;
  let fixture: ComponentFixture<OpenVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
