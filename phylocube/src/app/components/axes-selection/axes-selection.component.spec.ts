import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxesSelectionComponent } from './axes-selection.component';

describe('AxesSelectionComponent', () => {
  let component: AxesSelectionComponent;
  let fixture: ComponentFixture<AxesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AxesSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
