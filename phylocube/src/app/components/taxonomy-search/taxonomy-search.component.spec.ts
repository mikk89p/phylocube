import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomySearchComponent } from './taxonomy-search.component';

describe('TaxonomySearchComponent', () => {
  let component: TaxonomySearchComponent;
  let fixture: ComponentFixture<TaxonomySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonomySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
