import { Component } from '@angular/core';

@Component({
  selector: 'app-busqueda-binaria',
  templateUrl: './busqueda-binaria.component.html',
  styleUrls: ['./busqueda-binaria.component.css']
})
export class BusquedaBinariaComponent {
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

  // Historial de divisiones para pintar tablas por cada paso
  tablasDivision: Array<{
    low: number; mid: number; high: number;
    datos: Array<{ valor: string; index: number }>;
  }>;

  // Acción actual para rotular la evolución
  accionActual: 'busqueda' | 'eliminacion' = 'busqueda';

  constructor() {
    this.cantreg = 0;
    this.ingreso = '';
    this.retiro = '';
    this.busqueda = '';
    this.values = [];
    this.mostrarEstructura = false;
    this.contador = 0;
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.tamanoClave = 1;
    this.tablasDivision = [];
  }

  generarEstructura(): void {
    const n = this.cantreg;
    this.values = [];
    for (let i = 0; i < n; i++) this.values.push('');
    this.mostrarEstructura = true;
  }

  anadir(): void {
    this.limpiar();
    if (!this.ingreso || this.ingreso.length !== this.tamanoClave) {
      alert('Tamaño de la clave incorrecto');
      return;
    }
    let i = 0;
    let flag = true;
    while (flag && i < this.values.length) {
      if (this.values[i] === '') {
        this.values[i] = this.ingreso;
        this.resultado = `Valor ${this.ingreso} ingresado en la posición ${i}`;
        flag = false;
      } else {
        i++;
      }
    }
    if (flag) this.resultado = 'No hay espacio disponible';
    this.contador = i;
    this.anadirFinalizado = true;
  }

  buscar(): void {
    this.limpiar();
    this.tablasDivision = [];
    this.contador = 0;
    this.accionActual = 'busqueda';

    if (!this.busqueda) {
      this.resultado = 'Ingrese un valor para buscar';
      this.buscarFinalizado = true;
      return;
    }

    const base: Array<{ valor: string; index: number }> = this.values
      .map((v, i) => ({ valor: v, index: i }))
      .filter(x => x.valor !== '');

    if (base.length === 0) {
      this.resultado = 'La lista está vacía';
      this.buscarFinalizado = true;
      return;
    }

    const arr = [...base].sort((a, b) => a.valor.localeCompare(b.valor));

    let low = 0;
    let high = arr.length - 1;
    let foundAt: { valor: string; index: number } | null = null;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      // Snapshot del rango actual
      this.tablasDivision.push({
        low, mid, high,
        datos: arr.slice(low, high + 1)
      });

      this.contador++;

      if (arr[mid].valor === this.busqueda) {
        foundAt = arr[mid];
        break;
      } else if (this.busqueda.localeCompare(arr[mid].valor) < 0) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (foundAt) {
      this.resultado = `Valor ${foundAt.valor} encontrado en la posición original ${foundAt.index}`;
    } else {
      this.resultado = 'Valor no encontrado';
    }

    this.buscarFinalizado = true;
  }

  eliminar(): void {
    this.limpiar();
    this.tablasDivision = [];
    this.contador = 0;
    this.accionActual = 'eliminacion';

    if (!this.retiro) {
      this.resultado = 'Ingrese un valor para eliminar';
      this.eliminarFinalizado = true;
      return;
    }

    const base: Array<{ valor: string; index: number }> = this.values
      .map((v, i) => ({ valor: v, index: i }))
      .filter(x => x.valor !== '');

    if (base.length === 0) {
      this.resultado = 'La lista está vacía';
      this.eliminarFinalizado = true;
      return;
    }

    const arr = [...base].sort((a, b) => a.valor.localeCompare(b.valor));

    let low = 0;
    let high = arr.length - 1;
    let foundAt: { valor: string; index: number } | null = null;

    // Búsqueda binaria para encontrar el valor a eliminar
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      // Snapshot del rango actual
      this.tablasDivision.push({
        low, mid, high,
        datos: arr.slice(low, high + 1)
      });

      this.contador++;

      if (arr[mid].valor === this.retiro) {
        foundAt = arr[mid];
        break;
      } else if (this.retiro.localeCompare(arr[mid].valor) < 0) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (!foundAt) {
      this.resultado = 'Valor no encontrado';
      this.eliminarFinalizado = true;
      return;
    }

    // Eliminar en la posición original y compactar a la izquierda
    const idx = foundAt.index;
    for (let k = idx; k < this.values.length - 1; k++) {
      this.values[k] = this.values[k + 1];
    }
    this.values[this.values.length - 1] = '';

    this.resultado = `Valor ${foundAt.valor} eliminado de la posición original ${idx} y lista reorganizada`;
    this.eliminarFinalizado = true;
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
  }
}
