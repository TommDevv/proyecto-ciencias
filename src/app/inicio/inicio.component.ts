import { Component } from '@angular/core';
import { routes } from '../index/index.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  constructor (private router: Router){}

  routes: routes[]  = [
    {titulo: 'Busqueda Interna', ruta: '/busqueda-interna'},
    {titulo: 'Busqueda Externa', ruta: '/busqueda-externa'}
  ]

  redirect(route: string){
    this.router.navigate([route]);
  }
}
