import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbolDigitalComponent } from './arbol-digital.component';

describe('ArbolDigitalComponent', () => {
  let component: ArbolDigitalComponent;
  let fixture: ComponentFixture<ArbolDigitalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArbolDigitalComponent]
    });
    fixture = TestBed.createComponent(ArbolDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
