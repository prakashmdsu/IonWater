import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowercalculatorComponent } from './powercalculator.component';

describe('PowercalculatorComponent', () => {
  let component: PowercalculatorComponent;
  let fixture: ComponentFixture<PowercalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowercalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowercalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
