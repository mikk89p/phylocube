import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserCompatibilityComponent } from './browser-compatibility.component';

describe('BrowserCompatibilityComponent', () => {
  let component: BrowserCompatibilityComponent;
  let fixture: ComponentFixture<BrowserCompatibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserCompatibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserCompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
