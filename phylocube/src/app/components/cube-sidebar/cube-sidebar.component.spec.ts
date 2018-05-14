import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeSidebarComponent } from './cube-sidebar.component';

describe('CubeSidebarComponent', () => {
  let component: CubeSidebarComponent;
  let fixture: ComponentFixture<CubeSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CubeSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
