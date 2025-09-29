import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaLinealExternaComponent } from './busqueda-lineal-externa.component';

describe('BusquedaLinealExternaComponent', () => {
  let component: BusquedaLinealExternaComponent;
  let fixture: ComponentFixture<BusquedaLinealExternaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaLinealExternaComponent]
    });
    fixture = TestBed.createComponent(BusquedaLinealExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
