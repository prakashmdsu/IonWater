import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedwatersummaryComponent } from './feedwatersummary.component';

describe('FeedwatersummaryComponent', () => {
  let component: FeedwatersummaryComponent;
  let fixture: ComponentFixture<FeedwatersummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedwatersummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedwatersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
