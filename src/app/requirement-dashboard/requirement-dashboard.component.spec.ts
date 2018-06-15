import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDashboardComponent } from './requirement-dashboard.component';

describe('RequirementDashboardComponent', () => {
  let component: RequirementDashboardComponent;
  let fixture: ComponentFixture<RequirementDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
