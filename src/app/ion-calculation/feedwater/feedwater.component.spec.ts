import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedwaterComponent } from './feedwater.component';

describe('FeedwaterComponent', () => {
  let component: FeedwaterComponent;
  let fixture: ComponentFixture<FeedwaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedwaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedwaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
