import { Component } from '@angular/core';

interface FilaCompacta {
  posicion: number; // índice interno (0-based)
  elipsis?: boolean;
}

@Component({
  selector: 'app-hash',
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.css']
})
export class HashComponent {
  cantreg: number;
  ingreso: string;
  retiro: string;
  busqueda: string;
  resultado: string;
  values: string[];
  subtablas: string[][]; // Para anidamiento y encadenamiento
  mostrarEstructura: boolean;
  contador: number; // índice resaltado
  anadirFinalizado: boolean;
  buscarFinalizado: boolean;
  eliminarFinalizado: boolean;
  funcionHash: string;
  colision: string;

  estructuraCompacta: FilaCompacta[] = [];

  constructor() {
    this.cantreg = 0;
    this.ingreso = '';
    this.retiro = '';
    this.busqueda = '';
    this.values = [];
    this.subtablas = [];
    this.mostrarEstructura = false;
    this.contador = -1;
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.funcionHash = '';
    this.colision = '';
  }

  generarEstructura(): void {
    if (!this.funcionHash || !this.colision) {
      alert('Debe seleccionar una función hash y un método de colisión');
      return;
    }

    if (this.cantreg <= 0) {
      alert('Ingrese una cantidad válida');
      return;
    }

    this.values = Array(this.cantreg).fill('');
    this.subtablas = Array(this.cantreg).fill(null).map(() => []);
    this.mostrarEstructura = true;
    this.contador = -1;
    this.actualizarVistaCompacta();
  }

  anadir(): void {
    this.limpiar();

    if (this.ingreso.length !== 4) {
      alert('Tamaño de la clave incorrecto (debe ser de 4 dígitos)');
      return;
    }

    let index = this.calcularHash(this.ingreso);

    if (this.colision === 'anidamiento') {
      this.subtablas[index].push(this.ingreso);
      this.resultado = `Colisión en índice ${index + 1}. Insertado en subestructura: [${this.subtablas[index].join(', ')}]`;
    }
    else if (this.colision === 'encadenamiento') {
      if (this.values[index] === '') {
        this.values[index] = this.ingreso;
        this.resultado = `Valor ${this.ingreso} insertado en índice ${index + 1}`;
      } else {
        this.subtablas[index].push(this.ingreso);
        this.resultado = ` Colisión en índice ${index + 1}. Encadenado → [${this.values[index]}, ${this.subtablas[index].join(', ')}]`;
      }
    }
    else {
      let originalIndex = index;
      let i = 1;
      while (this.values[index] !== '') {
        if (this.colision === 'lineal') {
          index = (originalIndex + i) % this.values.length;
        } else if (this.colision === 'cuadrado') {
          index = (originalIndex + i * i) % this.values.length;
        }
        i++;
        if (i > this.values.length) {
          alert('Tabla llena. No se pudo insertar.');
          return;
        }
      }
      this.values[index] = this.ingreso;
      this.resultado = ` Colisión en índice ${originalIndex + 1}. Insertado en índice ${index + 1}`;
    }

    this.anadirFinalizado = true;
    this.contador = index;
    this.actualizarVistaCompacta();
  }

  buscar(): void {
    this.limpiar();

    if (!this.busqueda) {
      alert('Ingrese un valor a buscar');
      return;
    }

    let index = this.calcularHash(this.busqueda);
    let encontrado = false;
    let recorrido = index;

    if (this.colision === 'anidamiento') {
      const found = this.subtablas[index].includes(this.busqueda);
      encontrado = found;
    }
    else if (this.colision === 'encadenamiento') {
      if (this.values[index] === this.busqueda || this.subtablas[index].includes(this.busqueda)) {
        encontrado = true;
      }
    }
    else {
      let originalIndex = index;
      let i = 0;
      while (i < this.values.length) {
        let currentIndex = index;
        if (this.values[currentIndex] === this.busqueda) {
          encontrado = true;
          recorrido = currentIndex;
          break;
        }
        if (this.colision === 'lineal') {
          index = (originalIndex + ++i) % this.values.length;
        } else if (this.colision === 'cuadrado') {
          index = (originalIndex + i * i) % this.values.length;
          i++;
        }
        recorrido = index;
      }
    }

    this.contador = recorrido;
    this.resultado = encontrado
      ? `Valor ${this.busqueda} encontrado en índice ${recorrido + 1}`
      : 'Valor no encontrado';

    this.buscarFinalizado = true;
    this.actualizarVistaCompacta();
  }

  eliminar(): void {
    this.limpiar();

    if (!this.retiro) {
      alert('Ingrese un valor a eliminar');
      return;
    }

    let index = this.calcularHash(this.retiro);
    let eliminado = false;
    let recorrido = index;

    if (this.colision === 'anidamiento') {
      const idx = this.subtablas[index].indexOf(this.retiro);
      if (idx !== -1) {
        this.subtablas[index].splice(idx, 1);
        eliminado = true;
      }
    }
    else if (this.colision === 'encadenamiento') {
      if (this.values[index] === this.retiro) {
        this.values[index] = '';
        eliminado = true;
      } else {
        const idx = this.subtablas[index].indexOf(this.retiro);
        if (idx !== -1) {
          this.subtablas[index].splice(idx, 1);
          eliminado = true;
        }
      }
    }
    else {
      let originalIndex = index;
      let i = 0;
      while (i < this.values.length) {
        let currentIndex = index;
        if (this.values[currentIndex] === this.retiro) {
          this.values[currentIndex] = '';
          eliminado = true;
          recorrido = currentIndex;
          break;
        }
        if (this.colision === 'lineal') {
          index = (originalIndex + ++i) % this.values.length;
        } else if (this.colision === 'cuadrado') {
          index = (originalIndex + i * i) % this.values.length;
          i++;
        }
        recorrido = index;
      }
    }

    this.contador = recorrido;
    this.resultado = eliminado
      ? `Valor ${this.retiro} eliminado del índice ${recorrido + 1}`
      : 'Valor no encontrado';
    this.eliminarFinalizado = true;
    this.actualizarVistaCompacta();
  }

  limpiar(): void {
    this.anadirFinalizado = false;
    this.buscarFinalizado = false;
    this.eliminarFinalizado = false;
    this.resultado = '';
    this.contador = -1;
  }

  actualizarVistaCompacta(): void {
    const n = this.values.length;
    const filas: FilaCompacta[] = [];
    if (n === 0) {
      this.estructuraCompacta = [];
      return;
    }

    const indices = new Set<number>();
    indices.add(0);
    indices.add(n - 1);

    for (let i = 0; i < n; i++) {
      const ocupado =
        this.values[i] !== '' ||
        (this.subtablas[i] && this.subtablas[i].length > 0);
      if (ocupado) indices.add(i);
    }

    const mostrar = Array.from(indices).sort((a, b) => a - b);

    for (let i = 0; i < mostrar.length; i++) {
      const pos = mostrar[i];
      filas.push({ posicion: pos });
      if (i < mostrar.length - 1 && mostrar[i + 1] - pos > 1)
        filas.push({ posicion: -1, elipsis: true });
    }

    this.estructuraCompacta = filas;
  }

  calcularHash(valor: string): number {
    const clave = Number(valor);
    let index = 0;

    switch (this.funcionHash) {
      case 'mod':
        index = clave % this.cantreg;
        break;
      case 'cuadrado':
        index = this.hashCuad(clave);
        break;
      case 'truncamiento':
        index = this.hashTrunc(clave);
        break;
      case 'plegamiento':
        index = this.hashPleg(clave);
        break;
      default:
        alert('Función hash no válida');
    }

    return index % this.cantreg;
  }

  hashCuad(num: number): number {
    const str = String(Math.abs((num ** 2)));
    const len = str.length;
    const mid = Math.floor(len / 2);
    return Number(str[mid - 1] + str[mid]) || 0;
  }

  hashTrunc(clave: number): number {
    const str = String(clave);
    return Number(str.slice(0, 2)) || 0;
  }

  hashPleg(clave: number): number {
    const str = String(clave);
    const mitad = Math.floor(str.length / 2);
    const p1 = Number(str.slice(0, mitad));
    const p2 = Number(str.slice(mitad));
    return (p1 + p2) || 0;
  }

  exportarEstructura(): void {
    const estructura = {
      tipoEstructura: 'hash',
      funcionHash: this.funcionHash,
      metodoColision: this.colision,
      tablaPrincipal: this.values,
      subtablas: this.subtablas
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(estructura));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "estructura-hash.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  importarEstructura(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        if (data.tipoEstructura !== 'hash') {
          alert('El archivo no corresponde a una estructura hash');
          return;
        }

        if (data.metodoColision !== this.colision) {
          alert(`El método de colisión del archivo (${data.metodoColision}) no coincide con el seleccionado (${this.colision})`);
          return;
        }

        this.values = data.tablaPrincipal;
        this.subtablas = data.subtablas || Array(this.values.length).fill([]);
        this.cantreg = this.values.length;
        this.mostrarEstructura = true;
        this.resultado = 'Estructura importada correctamente';
        this.actualizarVistaCompacta();
      } catch (e) {
        alert('Error al leer el archivo JSON');
      }
    };

    reader.readAsText(file);
  }
}
