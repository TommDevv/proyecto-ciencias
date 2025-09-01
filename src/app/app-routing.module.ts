import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { InicioComponent } from './inicio/inicio.component';
import { BusquedaInternaLayoutComponent } from './busqueda-interna/busqueda-interna-layout/busqueda-interna-layout.component';
import { BusquedaLinealComponent } from './busqueda-interna/busqueda-lineal/busqueda-lineal.component';

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
      {path: 'busqueda-lineal', component:BusquedaLinealComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
