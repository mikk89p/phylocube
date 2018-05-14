import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeSidebarSecondaryComponent } from './cube-sidebar-secondary.component';

describe('CubeSidebarSecondaryComponent', () => {
  let component: CubeSidebarSecondaryComponent;
  let fixture: ComponentFixture<CubeSidebarSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubeSidebarSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeSidebarSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
