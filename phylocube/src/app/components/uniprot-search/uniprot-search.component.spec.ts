import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniprotSearchComponent } from './uniprot-search.component';

describe('UniprotSearchComponent', () => {
  let component: UniprotSearchComponent;
  let fixture: ComponentFixture<UniprotSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniprotSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniprotSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
