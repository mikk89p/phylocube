import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinDomainTableComponent } from './protein-domain-table.component';

describe('ProteinDomainTableComponent', () => {
  let component: ProteinDomainTableComponent;
  let fixture: ComponentFixture<ProteinDomainTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinDomainTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinDomainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
