import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContentContainerComponent } from './app-content-container.component';

describe('AppContentComponent', () => {
  let component: AppContentContainerComponent;
  let fixture: ComponentFixture<AppContentContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContentContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppContentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
