import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaExternaLayoutComponent } from './busqueda-externa-layout.component';

describe('BusquedaExternaLayoutComponent', () => {
  let component: BusquedaExternaLayoutComponent;
  let fixture: ComponentFixture<BusquedaExternaLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaExternaLayoutComponent]
    });
    fixture = TestBed.createComponent(BusquedaExternaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
