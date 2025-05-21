import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSharedComponent } from './chat-shared.component';

describe('ChatSharedComponent', () => {
  let component: ChatSharedComponent;
  let fixture: ComponentFixture<ChatSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSharedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
