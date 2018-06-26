import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinDomainInfoComponent } from './protein-domain-info.component';

describe('ProteinDomainInfoComponent', () => {
  let component: ProteinDomainInfoComponent;
  let fixture: ComponentFixture<ProteinDomainInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProteinDomainInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProteinDomainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
