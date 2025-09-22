import { Component } from '@angular/core';

@Component({
  selector: 'app-busqueda-lineal',
  templateUrl: './busqueda-lineal.component.html',
  styleUrls: ['./busqueda-lineal.component.css']
})
export class BusquedaLinealComponent {

  cantreg: number;
  ingreso: string;
  retiro: string;
  busqueda: string;
  resultado: string;
  values: string[];
  mostrarEstructura: boolean;
  contador: number;
  anadirFinalizado: boolean;
  buscarFinalizado: boolean;
  eliminarFinalizado: boolean;
  tamanoClave: number;

  constructor() {
    this.cantreg = 0;
    this.ingreso = '';
    this.retiro = '';
    this.busqueda = '';
    this.values = [];
    this.mostrarEstructura = false;
    this.contador = -1;
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.tamanoClave = 1;
  }

  generarEstructura(): void {
    this.values = [];
    for (let i: number = 0; i < this.cantreg; i++) {
      this.values.push('');
    }
    this.mostrarEstructura = true;
  }

  anadir(): void {
    this.limpiar();

    if (this.ingreso.length !== this.tamanoClave) {
      alert('Tamaño de la clave incorrecto');
      return;
    }

    const index = this.values.indexOf('');
    if (index === -1) {
      alert('No hay espacio disponible');
      return;
    }

    this.values[index] = this.ingreso;
    this.resultado = `Valor ${this.ingreso} ingresado en la posición ${index}`;

    const valoresNoVacios = this.values.filter(v => v !== '');
    valoresNoVacios.sort(); // Orden alfabético

    const vacios = new Array(this.values.length - valoresNoVacios.length).fill('');
    this.values = [...valoresNoVacios, ...vacios];

    this.contador = this.values.indexOf(this.ingreso);
    this.anadirFinalizado = true;
  }

  buscar(): void {
    this.limpiar();
    let i = 0;
    let flag: boolean = true;

    while (flag && i < this.values.length) {
      if (this.values[i] === this.busqueda) {
        this.resultado = `Valor ${this.values[i]} encontrado en la posición ${i}`;
        flag = false;
      } else if (i === this.values.length - 1) {
        flag = false;
        this.resultado = 'Valor no encontrado en la lista';
      } else {
        i++;
      }
    }

    this.contador = i;
    this.buscarFinalizado = true;
  }

  eliminar(): void {
    this.limpiar();

    let i = 0;
    let flag: boolean = true;

    while (flag && i < this.values.length) {
      if (this.values[i] === this.retiro) {
        this.values[i] = '';
        this.resultado = `Valor ${this.retiro} eliminado de la posición ${i}`;
        flag = false;
      } else if (i === this.values.length - 1) {
        flag = false;
        this.resultado = 'Valor no encontrado en la lista';
      } else {
        i++;
      }
    }

    this.contador = i;

    if (!flag) {
      const valoresNoVacios = this.values.filter(v => v !== '');
      valoresNoVacios.sort();
      const vacios = new Array(this.values.length - valoresNoVacios.length).fill('');
      this.values = [...valoresNoVacios, ...vacios];
    }

    this.eliminarFinalizado = true;
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
  }

  exportarEstructura(): void {
    const estructura = {
      tipoBusqueda: 'lineal',
      values: this.values,
      cantreg: this.cantreg,
      tamanoClave: this.tamanoClave
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(estructura));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "estructura-lineal.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importarEstructura(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        if (data.tipoBusqueda !== 'lineal') {
          alert(`Estructura incompatible: se esperaba tipoBusqueda 'lineal', pero se recibió '${data.tipoBusqueda}'`);
          return;
        }

        if (!Array.isArray(data.values)) {
          alert('El JSON no contiene una estructura válida.');
          return;
        }

        this.values = data.values;
        this.cantreg = data.cantreg || data.values.length;
        this.tamanoClave = data.tamanoClave || 1;
        this.mostrarEstructura = true;
        this.resultado = 'Estructura importada correctamente';
      } catch (error) {
        alert('Error al leer el archivo JSON');
      }
    };

    reader.readAsText(file);
  }
}
