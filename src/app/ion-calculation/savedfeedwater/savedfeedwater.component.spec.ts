import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedfeedwaterComponent } from './savedfeedwater.component';

describe('SavedfeedwaterComponent', () => {
  let component: SavedfeedwaterComponent;
  let fixture: ComponentFixture<SavedfeedwaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedfeedwaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedfeedwaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
