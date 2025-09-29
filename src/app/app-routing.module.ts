import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { InicioComponent } from './inicio/inicio.component';
import { BusquedaInternaLayoutComponent } from './busqueda-interna/busqueda-interna-layout/busqueda-interna-layout.component';
import { BusquedaLinealComponent } from './busqueda-interna/busqueda-lineal/busqueda-lineal.component';
import { BusquedaBinariaComponent } from './busqueda-interna/busqueda-binaria/busqueda-binaria.component';
import { HashComponent } from './busqueda-interna/hash/hash.component';
import { ArbolDigitalComponent } from './busqueda-interna/arbol-digital/arbol-digital.component';
import { ResiduosComponent } from './busqueda-interna/residuos/residuos.component';
import { BusquedaResiduosMultiplesComponent } from './busqueda-interna/busqueda-residuos-multiples/busqueda-residuos-multiples.component';
import { HuffmanComponent } from './busqueda-interna/huffman/huffman.component';
import { BusquedaExternaLayoutComponent } from './busqueda-externa/busqueda-externa-layout/busqueda-externa-layout.component';
import { BusquedaLinealExternaComponent } from './busqueda-externa/busqueda-lineal-externa/busqueda-lineal-externa.component';
import { BusquedaBinariaExternaComponent } from './busqueda-externa/busqueda-binaria-externa/busqueda-binaria-externa.component';

const routes: Routes = [
   {
    path: '',
    component: IndexComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      {
        path: 'busqueda-interna', 
        component: BusquedaInternaLayoutComponent},
        {
        path: 'busqueda-externa', 
        component: BusquedaExternaLayoutComponent},
      {path: 'busqueda-lineal', component: BusquedaLinealComponent},
      {path: 'busqueda-binaria', component: BusquedaBinariaComponent},
      {path: 'hash', component: HashComponent},
      {path: 'arbol-digital', component: ArbolDigitalComponent},
      {path: 'residuos', component: ResiduosComponent},
      {path: 'residuos-multiples', component: BusquedaResiduosMultiplesComponent},
      {path: 'huffman', component: HuffmanComponent},
      {path: 'busqueda-lineal-externa', component: BusquedaLinealExternaComponent},
      {path: 'husqueda-binaria-externa', component: BusquedaBinariaExternaComponent},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
