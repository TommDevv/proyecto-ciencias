import { Component } from '@angular/core';

@Component({
  selector: 'app-busqueda-binaria-externa',
  templateUrl: './busqueda-binaria-externa.component.html',
  styleUrls: ['./busqueda-binaria-externa.component.css']
})
export class BusquedaBinariaExternaComponent {
  cantreg = 0;
  tamanoClave = 1;

  ingreso = '';
  busqueda = '';
  retiro = '';
  resultado = '';

  mostrarEstructura = false;

  bloques: string[][] = [];
  tamanoBloque = 0;

  anadirFinalizado = false;
  buscarFinalizado = false;
  eliminarFinalizado = false;

  pasos: Array<{
    bloque: number;
    low: number;
    mid: number;
    high: number;
    datos: string[];
  }> = [];

  generarEstructura(): void {
    if (this.cantreg <= 0) {
      alert('Ingrese una cantidad válida');
      return;
    }

    this.tamanoBloque = Math.ceil(Math.sqrt(this.cantreg));
    const cantidadBloques = Math.ceil(this.cantreg / this.tamanoBloque);
    this.bloques = Array.from({ length: cantidadBloques }, () =>
      new Array(this.tamanoBloque).fill('')
    );

    this.mostrarEstructura = true;
    this.limpiar();
    this.resultado = `Estructura generada con ${cantidadBloques} bloques de tamaño ${this.tamanoBloque}`;
  }

  anadir(): void {
    this.limpiar();
    if (this.ingreso.length !== this.tamanoClave) {
      alert(`La clave debe tener ${this.tamanoClave} caracteres`);
      return;
    }

    const plano = this.flattenValues();
    const indexLibre = plano.indexOf('');
    if (indexLibre === -1) {
      alert('No hay espacio disponible');
      return;
    }

    plano[indexLibre] = this.ingreso;
    plano.sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)));
    this.reconstruirDesdePlano(plano);

    this.resultado = `Valor ${this.ingreso} insertado correctamente`;
    this.anadirFinalizado = true;
    this.ingreso = '';
  }

  buscar(): void {
    this.limpiar();
    if (!this.busqueda) {
      alert('Ingrese una clave para buscar');
      return;
    }

    this.pasos = [];
    // Determinar el bloque donde puede estar
    const maximos = this.bloques.map(b => this.maximoBloque(b));
    let bloqueIdx = -1;
    for (let i = 0; i < maximos.length; i++) {
      if (this.busqueda <= maximos[i]) {
        bloqueIdx = i;
        break;
      }
    }
    if (bloqueIdx === -1) bloqueIdx = this.bloques.length - 1;

    const bloque = this.bloques[bloqueIdx];
    const arr = bloque.filter(v => v !== '');
    if (arr.length === 0) {
      this.resultado = 'Bloque vacío, valor no encontrado';
      this.buscarFinalizado = true;
      return;
    }

    let low = 0;
    let high = arr.length - 1;
    let encontrado = -1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      this.pasos.push({
        bloque: bloqueIdx,
        low,
        mid,
        high,
        datos: [...arr]
      });

      if (arr[mid] === this.busqueda) {
        encontrado = mid;
        break;
      } else if (this.busqueda < arr[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (encontrado !== -1) {
      this.resultado = `Valor ${this.busqueda} encontrado en bloque ${bloqueIdx + 1}, posición ${encontrado + 1}`;
    } else {
      this.resultado = 'Valor no encontrado';
    }
    this.buscarFinalizado = true;
  }

  eliminar(): void {
    this.limpiar();
    if (!this.retiro) {
      alert('Ingrese una clave para eliminar');
      return;
    }

    const plano = this.flattenValues();
    const idx = plano.indexOf(this.retiro);
    if (idx === -1) {
      this.resultado = 'Valor no encontrado';
      this.eliminarFinalizado = true;
      return;
    }

    plano[idx] = '';
    plano.sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)));
    this.reconstruirDesdePlano(plano);
    this.resultado = `Valor ${this.retiro} eliminado correctamente`;
    this.eliminarFinalizado = true;
  }

  flattenValues(): string[] {
    return this.bloques.flat();
  }

  reconstruirDesdePlano(plano: string[]): void {
    this.bloques = [];
    for (let i = 0; i < plano.length; i += this.tamanoBloque) {
      this.bloques.push(plano.slice(i, i + this.tamanoBloque));
    }
  }

  maximoBloque(b: string[]): string {
    const noVacios = b.filter(v => v !== '');
    return noVacios.length ? noVacios[noVacios.length - 1] : '';
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.pasos = [];
  }

  exportarEstructura(): void {
    const estructura = {
      tipoBusqueda: 'binaria_externa',
      cantreg: this.cantreg,
      tamanoClave: this.tamanoClave,
      tamanoBloque: this.tamanoBloque,
      bloques: this.bloques
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estructura));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'estructura-binaria-externa.json';
    a.click();
  }

  importarEstructura(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.tipoBusqueda !== 'binaria_externa') {
          alert('Estructura incompatible.');
          return;
        }
        this.cantreg = data.cantreg;
        this.tamanoClave = data.tamanoClave;
        this.tamanoBloque = data.tamanoBloque;
        this.bloques = data.bloques;
        this.mostrarEstructura = true;
        this.resultado = 'Estructura importada correctamente';
      } catch {
        alert('Error al importar');
      }
    };
    reader.readAsText(input.files[0]!);
  }
}
