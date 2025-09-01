import { Component } from '@angular/core';

@Component({
  selector: 'app-busqueda-lineal',
  templateUrl: './busqueda-lineal.component.html',
  styleUrls: ['./busqueda-lineal.component.css']
})

export class BusquedaLinealComponent {

  cantreg: number;
  ingreso: string ;
  retiro: string ;
  busqueda: string;
  resultado: string;
  values: string[];
  mostrarEstructura: boolean;
  contador:number;
  anadirFinalizado: boolean;
  buscarFinalizado: boolean;
  eliminarFinalizado: boolean;

  constructor(){
    this.cantreg = 0;
    this.ingreso = '';
    this.retiro = '';
    this.busqueda = '';
    this.values = []
    this.mostrarEstructura = false;
    this.contador = 0;
    this.anadirFinalizado = false
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
  }

  generarEstructura(): void{
    const n = this.cantreg;
    for(let i: number = 0; i < n; i++){
      this.values.push('');
    }

    console.log(this.values)
    this.mostrarEstructura= true
  }

  anadir(): void{
    this.limpiar();
    var i = 0;
    var flag: boolean = true;
      while(flag){
        if(this.values[i] === ''){
          this.resultado = `Valor ${this.values[i]} ingresado en la posición ${i}`
          this.values[i] = this.ingreso;
          flag = false;
        }else{
          i++
        }
      }
    this.contador = i;
    this.anadirFinalizado = true;
  }

  buscar(): void{
    this.limpiar();
    var i = 0;
    var flag: boolean = true;
      while(flag){
        if(this.values[i] === this.busqueda){
          this.resultado = `Valor ${this.values[i]} encontrado en la posición ${i}`
          flag = false;
        }else if(i === this.values.length - 1){
          flag = false;
          this.resultado = ' Valor no encontrado en la lista'
        }
        else {
          i++
        }
      }
    this.contador = i;
    this.buscarFinalizado = true;
  }

  eliminar(): void{
    this.limpiar();
    var i = 0;
    var flag: boolean = true;
      while(flag){
        if(this.values[i] === this.retiro){
          this.values[i] = '';
          this.resultado = `Valor ${this.values[i]} eliminado en la posición ${i}`
          flag = false;
        }else if(i === this.values.length -1){
          flag = false;
          this.resultado = ' Valor no encontrado en la lista'
        }
        else{
          i++
        }
      }
    this.contador = i;
    this.eliminarFinalizado = true;
  }

  limpiar(){
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
  }

}
