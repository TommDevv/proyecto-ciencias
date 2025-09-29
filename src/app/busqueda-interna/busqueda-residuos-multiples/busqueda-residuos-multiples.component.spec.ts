import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaResiduosMultiplesComponent } from './busqueda-residuos-multiples.component';

describe('BusquedaResiduosMultiplesComponent', () => {
  let component: BusquedaResiduosMultiplesComponent;
  let fixture: ComponentFixture<BusquedaResiduosMultiplesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaResiduosMultiplesComponent]
    });
    fixture = TestBed.createComponent(BusquedaResiduosMultiplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
