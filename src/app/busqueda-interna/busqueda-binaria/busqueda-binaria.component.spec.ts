import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaBinariaComponent } from './busqueda-binaria.component';

describe('BusquedaBinariaComponent', () => {
  let component: BusquedaBinariaComponent;
  let fixture: ComponentFixture<BusquedaBinariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaBinariaComponent]
    });
    fixture = TestBed.createComponent(BusquedaBinariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
