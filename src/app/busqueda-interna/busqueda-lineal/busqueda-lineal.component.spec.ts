import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaLinealComponent } from './busqueda-lineal.component';

describe('BusquedaLinealComponent', () => {
  let component: BusquedaLinealComponent;
  let fixture: ComponentFixture<BusquedaLinealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaLinealComponent]
    });
    fixture = TestBed.createComponent(BusquedaLinealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
