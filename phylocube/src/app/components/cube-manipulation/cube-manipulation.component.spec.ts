import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeManipulationComponent } from './cube-manipulation.component';

describe('CubeManipulationComponent', () => {
  let component: CubeManipulationComponent;
  let fixture: ComponentFixture<CubeManipulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubeManipulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
