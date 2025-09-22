import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodoComponent } from './nodo.component';

describe('NodoComponent', () => {
  let component: NodoComponent;
  let fixture: ComponentFixture<NodoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodoComponent]
    });
    fixture = TestBed.createComponent(NodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
