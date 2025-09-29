import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InicioComponent } from './inicio/inicio.component';
import { BusquedaInternaLayoutComponent } from './busqueda-interna/busqueda-interna-layout/busqueda-interna-layout.component';
import { BusquedaLinealComponent } from './busqueda-interna/busqueda-lineal/busqueda-lineal.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BusquedaBinariaComponent } from './busqueda-interna/busqueda-binaria/busqueda-binaria.component';
import { HashComponent } from './busqueda-interna/hash/hash.component';
import { ArbolDigitalComponent } from './busqueda-interna/arbol-digital/arbol-digital.component';
import { NodoComponent } from './nodo/nodo.component';
import { ResiduosComponent } from './busqueda-interna/residuos/residuos.component';
import { BusquedaResiduosMultiplesComponent } from './busqueda-interna/busqueda-residuos-multiples/busqueda-residuos-multiples.component';
import { HuffmanComponent } from './busqueda-interna/huffman/huffman.component';
import { BusquedaExternaLayoutComponent } from './busqueda-externa/busqueda-externa-layout/busqueda-externa-layout.component';
import { BusquedaLinealExternaComponent } from './busqueda-externa/busqueda-lineal-externa/busqueda-lineal-externa.component';
import { BusquedaBinariaExternaComponent } from './busqueda-externa/busqueda-binaria-externa/busqueda-binaria-externa.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AppHeaderComponent,
    InicioComponent,
    BusquedaInternaLayoutComponent,
    BusquedaLinealComponent,
    BusquedaBinariaComponent,
    HashComponent,
    ArbolDigitalComponent,
    NodoComponent,
    ResiduosComponent,
    BusquedaResiduosMultiplesComponent,
    HuffmanComponent,
    BusquedaExternaLayoutComponent,
    BusquedaLinealExternaComponent,
    BusquedaBinariaExternaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    NgbModule,
    FormsModule      
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
