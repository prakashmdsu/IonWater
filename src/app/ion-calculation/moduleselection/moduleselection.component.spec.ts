import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleselectionComponent } from './moduleselection.component';

describe('ModuleselectionComponent', () => {
  let component: ModuleselectionComponent;
  let fixture: ComponentFixture<ModuleselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
