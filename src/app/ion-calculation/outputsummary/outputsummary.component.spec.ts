import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputsummaryComponent } from './outputsummary.component';

describe('OutputsummaryComponent', () => {
  let component: OutputsummaryComponent;
  let fixture: ComponentFixture<OutputsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
