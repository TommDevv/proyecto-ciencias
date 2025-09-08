import { Component } from '@angular/core';

@Component({
  selector: 'app-hash',
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.css']
})
export class HashComponent {
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
  tamanoClave: number;

  constructor(){
    this.cantreg = 0;
    this.ingreso = '';
    this.retiro = '';
    this.busqueda = '';
    this.values = []
    this.mostrarEstructura = false;
    this.contador = -1;
    this.anadirFinalizado = false
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.tamanoClave = 1;
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
    if(this.ingreso.length != this.tamanoClave){
      alert('Tamaño de la clave incorrecto')
      return
    }
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

  hashMod(clave: number, tamaño: number): number{
    return (clave%tamaño) + 1;
  }

  hashCuad(num: number): number{
    const str = String(Math.abs((num**2)));
    const len = str.length;

    if (len < 2) {
      return Number(str);
    }

    if (len % 2 === 0) {
      const mid = len / 2;
      return Number(str[mid - 1] + str[mid]);
    } else {

      const mid = Math.floor(len / 2);
      return Number(str[mid - 1] + str[mid]) + 1;
    }
  }

  hashTrunc(clave: number){
    const str = String(Math.abs(clave));
    const len = str.length;

    if (len < 2) {
      return Number(str);
    }

    return Number(str[0] + str[str.length]) + 1;
  }

  hashPleg(clave: number){
    const str = String(Math.abs(clave));
    const mitad = Math.floor(str.length/2);
    
    const primera = str.slice(0, mitad);
    const segunda = str.slice(mitad);

    return Number(primera) + Number(segunda) + 1;
  }
}
