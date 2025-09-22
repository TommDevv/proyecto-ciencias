import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nodo',
  templateUrl: './nodo.component.html',
  styleUrls: ['./nodo.component.css']
})
export class NodoComponent {
  @Input() nodo: any;
  objectKeys = Object.keys;
}
