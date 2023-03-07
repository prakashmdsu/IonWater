import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedpowerrequirementsComponent } from './estimatedpowerrequirements.component';

describe('EstimatedpowerrequirementsComponent', () => {
  let component: EstimatedpowerrequirementsComponent;
  let fixture: ComponentFixture<EstimatedpowerrequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatedpowerrequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedpowerrequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
