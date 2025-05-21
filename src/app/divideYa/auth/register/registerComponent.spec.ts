import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './registerComponent';

describe('RegistereComponent', () => {
  let component: RegistereComponent;
  let fixture: ComponentFixture<RegistereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
