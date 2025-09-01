import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaInternaLayoutComponent } from './busqueda-interna-layout.component';

describe('BusquedaInternaLayoutComponent', () => {
  let component: BusquedaInternaLayoutComponent;
  let fixture: ComponentFixture<BusquedaInternaLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaInternaLayoutComponent]
    });
    fixture = TestBed.createComponent(BusquedaInternaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
