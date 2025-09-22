import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { InicioComponent } from './inicio/inicio.component';
import { BusquedaInternaLayoutComponent } from './busqueda-interna/busqueda-interna-layout/busqueda-interna-layout.component';
import { BusquedaLinealComponent } from './busqueda-interna/busqueda-lineal/busqueda-lineal.component';
import { BusquedaBinariaComponent } from './busqueda-interna/busqueda-binaria/busqueda-binaria.component';
import { HashComponent } from './busqueda-interna/hash/hash.component';
import { ArbolDigitalComponent } from './busqueda-interna/arbol-digital/arbol-digital.component';

const routes: Routes = [
   {
    path: '',
    component: IndexComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      {
        path: 'busqueda-interna', 
        component: BusquedaInternaLayoutComponent,},
      {path: 'busqueda-lineal', component: BusquedaLinealComponent},
      {path: 'busqueda-binaria', component: BusquedaBinariaComponent},
      {path: 'hash', component: HashComponent},
      {path: 'arbol-digital', component: ArbolDigitalComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
