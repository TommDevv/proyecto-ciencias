import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaBinariaExternaComponent } from './busqueda-binaria-externa.component';

describe('BusquedaBinariaExternaComponent', () => {
  let component: BusquedaBinariaExternaComponent;
  let fixture: ComponentFixture<BusquedaBinariaExternaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaBinariaExternaComponent]
    });
    fixture = TestBed.createComponent(BusquedaBinariaExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
