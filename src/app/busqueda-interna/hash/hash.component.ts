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
  funcionHash: string;

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
    this.funcionHash = '';
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
    if(this.ingreso.length != 4){
      alert('Tamaño de la clave incorrecto')
      return
    }
    var index = 0;

    switch(this.funcionHash){
      case 'mod':
        index = this.hashMod(Number(this.ingreso), this.values.length);
        break;
      case 'cuadrado':
        index = this.hashCuad(Number(this.ingreso));
        break;
      case 'truncamiento':
        index = this.hashTrunc(Number(this.ingreso));
        break;
      case 'plegamiento':
        index = this.hashPleg(Number(this.ingreso));
        break;
      default:
        alert('Seleccione una función hash')
        return
    }

    if (index >= this.values.length){
      index = index - this.values.length;
    }

    this.values[index] = this.ingreso;
    this.resultado = `Valor ${this.values[index]} ingresado en la posición ${index}`;
    this.anadirFinalizado = true;
  }

  buscar(): void{
    this.limpiar();

    var index = 0;

    switch(this.funcionHash){
      case 'mod':
        index = this.hashMod(Number(this.busqueda), this.values.length);
        break;
      case 'cuadrado':
        index = this.hashCuad(Number(this.busqueda));
        break;
      case 'truncamiento':
        index = this.hashTrunc(Number(this.busqueda));
        break;
      case 'plegamiento':
        index = this.hashPleg(Number(this.busqueda));
        break;
      default:
        alert('Seleccione una función hash')
        return
    }

    if (index >= this.values.length){
      index = index - this.values.length;
    }


    if(this.values[index] === ''){
      this.resultado = ' Valor no encontrado en la lista'
      this.buscarFinalizado = true;
      return;
    } else {
      this.resultado = `Valor ${this.values[index]} encontrado en la posición ${index}`;
      this.buscarFinalizado = true;
      return;
    }

  }

  eliminar(): void{
    this.limpiar();
    
    var index = 0;

    switch(this.funcionHash){
      case 'mod':
        index = this.hashMod(Number(this.retiro), this.values.length);
        break;
      case 'cuadrado':
        index = this.hashCuad(Number(this.retiro));
        break;
      case 'truncamiento':
        index = this.hashTrunc(Number(this.retiro));
        break;
      case 'plegamiento':
        index = this.hashPleg(Number(this.retiro));
        break;
      default:
        alert('Seleccione una función hash')
        return
    }

    if (index >= this.values.length){
      index = index - this.values.length;
    }

    if(this.values[index] === ''){
      this.resultado = ' Valor no encontrado en la lista'
      this.eliminarFinalizado = true;
      return;
    } else {
      this.values[index] = '';
      this.resultado = `Valor ${this.retiro} eliminado en la posición ${index}`;
      this.eliminarFinalizado = true;
      return;
    }
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
