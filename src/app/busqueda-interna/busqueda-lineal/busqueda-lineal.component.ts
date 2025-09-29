import { Component } from '@angular/core';

interface FilaCompacta {
  posicion: number; // 0-based internamente
  valor: string;
  elipsis?: boolean;
}

@Component({
  selector: 'app-busqueda-lineal',
  templateUrl: './busqueda-lineal.component.html',
  styleUrls: ['./busqueda-lineal.component.css']
})
export class BusquedaLinealComponent {
  cantreg = 0;
  tamanoClave = 1;

  ingreso = '';
  retiro = '';
  busqueda = '';
  resultado = '';

  values: string[] = [];
  mostrarEstructura = false;

  contador = -1; // 0-based para resaltar fila
  anadirFinalizado = false;
  buscarFinalizado = false;
  eliminarFinalizado = false;

  estructuraCompacta: FilaCompacta[] = [];

  generarEstructura(): void {
    if (this.cantreg <= 0) {
      alert('Ingrese una cantidad válida');
      return;
    }
    this.values = new Array(this.cantreg).fill('');
    this.mostrarEstructura = true;
    this.contador = -1;
    this.resultado = '';
    this.actualizarVistaCompacta();
  }

  anadir(): void {
    this.limpiar();
    if (this.ingreso.length !== this.tamanoClave) {
      alert('Tamaño de la clave incorrecto');
      return;
    }

    const indexLibre = this.values.indexOf('');
    if (indexLibre === -1) {
      alert('No hay espacio disponible');
      return;
    }

    this.values[indexLibre] = this.ingreso;

    // Reordenar: no vacíos alfabéticos al inicio
    this.ordenar();

    const pos = this.values.indexOf(this.ingreso);
    this.resultado = `Valor ${this.ingreso} ingresado en la posición ${pos + 1}`;
    this.contador = pos;
    this.anadirFinalizado = true;
    this.actualizarVistaCompacta();
    this.ingreso = '';
  }

  buscar(): void {
    this.limpiar();

    let i = 0;
    let encontrado = false;
    while (i < this.values.length) {
      if (this.values[i] === this.busqueda) {
        encontrado = true;
        break;
      }
      i++;
    }

    if (encontrado) {
      this.resultado = `Valor ${this.busqueda} encontrado en la posición ${i + 1}`;
      this.contador = i;
    } else {
      // Mantener el comportamiento de "filas recorridas" del original:
      // si no se encontró, i == this.values.length
      const ultimaRecorrida = Math.max(0, this.values.length - 1);
      this.resultado = 'Valor no encontrado en la lista';
      this.contador = this.values.length > 0 ? ultimaRecorrida : -1;
    }

    this.buscarFinalizado = true;
    this.actualizarVistaCompacta();
  }

  eliminar(): void {
    this.limpiar();

    let i = 0;
    let eliminado = false;
    while (i < this.values.length) {
      if (this.values[i] === this.retiro) {
        this.values[i] = '';
        eliminado = true;
        break;
      }
      i++;
    }

    if (eliminado) {
      this.ordenar();
      // Buscar la nueva posición del primer vacío tras ordenar
      this.resultado = `Valor ${this.retiro} eliminado de la posición ${i + 1}`;
      this.contador = Math.min(i, this.values.length - 1);
    } else {
      this.resultado = 'Valor no encontrado en la lista';
      this.contador = this.values.length > 0 ? this.values.length - 1 : -1;
    }

    this.eliminarFinalizado = true;
    this.actualizarVistaCompacta();
    this.retiro = '';
  }

  ordenar(): void {
    const noVacios = this.values.filter(v => v !== '').sort();
    const vacios = new Array(this.values.length - noVacios.length).fill('');
    this.values = [...noVacios, ...vacios];
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
  }

  filasRecorridas(): number {
    return this.contador >= 0 ? this.contador + 1 : 0; // mostrado 1-based
    // si contador == -1 (sin estructura), muestra 0
  }

  actualizarVistaCompacta(): void {
    const n = this.values.length;
    const filas: FilaCompacta[] = [];
    if (n === 0) {
      this.estructuraCompacta = [];
      return;
    }

    // Indices que siempre mostraremos: 0 y n-1
    const indices = new Set<number>();
    indices.add(0);
    indices.add(n - 1);

    // Todas las posiciones ocupadas
    for (let i = 0; i < n; i++) {
      if (this.values[i] !== '') indices.add(i);
    }

    // Ordenar y eliminar duplicados (Set ya deduplica)
    const mostrar = Array.from(indices).sort((a, b) => a - b);

    // Construir filas con elipsis
    for (let i = 0; i < mostrar.length; i++) {
      const pos = mostrar[i];
      filas.push({ posicion: pos, valor: this.values[pos] });

      if (i < mostrar.length - 1) {
        const siguiente = mostrar[i + 1];
        if (siguiente - pos > 1) {
          filas.push({ posicion: -1, valor: '', elipsis: true });
        }
      }
    }

    // Caso especial: si n == 1, ya agregamos solo una fila
    this.estructuraCompacta = filas;
  }

  exportarEstructura(): void {
    const estructura = {
      tipoBusqueda: 'lineal',
      values: this.values,
      cantreg: this.cantreg,
      tamanoClave: this.tamanoClave
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estructura));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'estructura-lineal.json';
    a.click();
  }

  importarEstructura(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.tipoBusqueda !== 'lineal' || !Array.isArray(data.values)) {
          alert('Estructura incompatible.');
          return;
        }
        this.values = data.values;
        this.cantreg = data.cantreg || this.values.length;
        this.tamanoClave = data.tamanoClave || 1;
        this.mostrarEstructura = true;
        this.contador = -1;
        this.actualizarVistaCompacta();
        this.resultado = 'Estructura importada correctamente';
      } catch {
        alert('Error al importar');
      }
    };
    reader.readAsText(input.files[0]!);
  }
}
