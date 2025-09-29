import { Component } from '@angular/core';

@Component({
  selector: 'app-busqueda-lineal-externa',
  templateUrl: './busqueda-lineal-externa.component.html',
  styleUrls: ['./busqueda-lineal-externa.component.css']
})
export class BusquedaLinealExternaComponent {
  cantreg = 0;
  tamanoClave = 1;

  ingreso = '';
  busqueda = '';
  retiro = '';
  resultado = '';

  mostrarEstructura = false;

  bloques: string[][] = [];
  tamanoBloque = 0;

  bloqueActual = -1; // índice del bloque resaltado
  filaActual = -1;   // índice interno de la fila resaltada dentro del bloque

  anadirFinalizado = false;
  buscarFinalizado = false;
  eliminarFinalizado = false;

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

    const posGlobal = plano.indexOf(this.ingreso);
    this.bloqueActual = Math.floor(posGlobal / this.tamanoBloque);
    this.filaActual = posGlobal % this.tamanoBloque;
    this.anadirFinalizado = true;
    this.resultado = `Valor ${this.ingreso} insertado en bloque ${this.bloqueActual + 1}, posición ${this.filaActual + 1}`;
    this.ingreso = '';
  }

  buscar(): void {
    this.limpiar();
    const clave = this.busqueda.trim();
    if (!clave) return;

    const maximos = this.bloques.map(b => this.maximoBloque(b));
    let bloqueEncontrado = -1;

    // Buscar el bloque donde podría estar
    for (let i = 0; i < maximos.length; i++) {
      if (clave <= maximos[i]) {
        bloqueEncontrado = i;
        break;
      }
    }

    if (bloqueEncontrado === -1) bloqueEncontrado = this.bloques.length - 1;

    this.bloqueActual = bloqueEncontrado;

    // Búsqueda lineal dentro del bloque
    const bloque = this.bloques[bloqueEncontrado];
    const fila = bloque.indexOf(clave);

    if (fila !== -1) {
      this.filaActual = fila;
      this.resultado = `Valor ${clave} encontrado en bloque ${bloqueEncontrado + 1}, posición ${fila + 1}`;
    } else {
      this.filaActual = bloque.length - 1;
      this.resultado = 'Valor no encontrado';
    }

    this.buscarFinalizado = true;
  }

  eliminar(): void {
    this.limpiar();
    const clave = this.retiro.trim();
    if (!clave) return;

    const plano = this.flattenValues();
    const index = plano.indexOf(clave);
    if (index === -1) {
      this.resultado = 'Valor no encontrado';
      return;
    }

    plano[index] = '';
    plano.sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)));
    this.reconstruirDesdePlano(plano);

    this.bloqueActual = Math.floor(index / this.tamanoBloque);
    this.filaActual = index % this.tamanoBloque;
    this.resultado = `Valor ${clave} eliminado`;
    this.eliminarFinalizado = true;
    this.retiro = '';
  }

  maximoBloque(bloque: string[]): string {
    const noVacios = bloque.filter(v => v !== '');
    return noVacios.length ? noVacios[noVacios.length - 1] : '';
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

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.bloqueActual = -1;
    this.filaActual = -1;
    this.resultado = '';
  }

  exportarEstructura(): void {
    const estructura = {
      tipoBusqueda: 'lineal_externa',
      cantreg: this.cantreg,
      tamanoClave: this.tamanoClave,
      tamanoBloque: this.tamanoBloque,
      bloques: this.bloques
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estructura));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'estructura-lineal-externa.json';
    a.click();
  }

  importarEstructura(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.tipoBusqueda !== 'lineal_externa') {
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
