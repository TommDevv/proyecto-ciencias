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

  tablasDivision: Array<{
    low: number;
    mid: number;
    high: number;
    datos: Array<{ valor: string; index: number }>;
  }>;

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

    if (flag) {
      this.resultado = 'No hay espacio disponible';
    } else {
      const valoresNoVacios = this.values.filter(v => v !== '');
      valoresNoVacios.sort(); // alfabético
      const vacios = new Array(this.values.length - valoresNoVacios.length).fill('');
      this.values = [...valoresNoVacios, ...vacios];
    }

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

    const base = this.values
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
      this.tablasDivision.push({
        low,
        mid,
        high,
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

    this.resultado = foundAt
      ? `Valor ${foundAt.valor} encontrado en la posición original ${foundAt.index}`
      : 'Valor no encontrado';

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

    const base = this.values
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

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      this.tablasDivision.push({
        low,
        mid,
        high,
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

    const idx = foundAt.index;
    for (let k = idx; k < this.values.length - 1; k++) {
      this.values[k] = this.values[k + 1];
    }
    this.values[this.values.length - 1] = '';

    const valoresNoVacios = this.values.filter(v => v !== '');
    valoresNoVacios.sort();
    const vacios = new Array(this.values.length - valoresNoVacios.length).fill('');
    this.values = [...valoresNoVacios, ...vacios];

    this.resultado = `Valor ${foundAt.valor} eliminado de la posición original ${idx} y lista reorganizada`;
    this.eliminarFinalizado = true;
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
  }

  exportarEstructura(): void {
    const estructura = {
      tipoBusqueda: 'binaria',
      values: this.values,
      cantreg: this.cantreg,
      tamanoClave: this.tamanoClave
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(estructura));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "estructura-binaria.json");
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

        if (data.tipoBusqueda !== 'binaria') {
          alert(`Estructura incompatible. Se esperaba tipoBusqueda 'binaria' y se recibió '${data.tipoBusqueda}'`);
          return;
        }

        if (!Array.isArray(data.values)) {
          alert('Estructura inválida. El campo "values" debe ser un arreglo.');
          return;
        }

        this.values = data.values;
        this.cantreg = data.cantreg || data.values.length;
        this.tamanoClave = data.tamanoClave || 1;
        this.mostrarEstructura = true;
        this.resultado = 'Estructura importada correctamente';
      } catch (error) {
        alert('Error al leer el archivo JSON.');
      }
    };

    reader.readAsText(file);
  }
}
