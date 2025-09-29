import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';

interface NodoArbol {
  etiqueta: string; // valor del bloque (por ejemplo "10", "00", "1")
  hijos: NodoArbol[];
  letra?: string;   // solo en hojas
}

@Component({
  selector: 'app-busqueda-residuos-multiples',
  templateUrl: './busqueda-residuos-multiples.component.html',
  styleUrls: ['./busqueda-residuos-multiples.component.css']
})
export class BusquedaResiduosMultiplesComponent {
  @ViewChild('networkContainer', { static: false }) networkContainer!: ElementRef;
  network!: Network;

  raiz: NodoArbol | null = null;
  digitosAsociar: number | null = null;
  ingreso = '';
  busqueda = '';
  retiro = '';
  resultado = '';
  mostrarArbol = false;

  letrasInsertadas: { letra: string; binario: string }[] = [];

  // ========================= UTILIDADES =========================
  digitosAsociarValido(): boolean {
    return !!this.digitosAsociar && this.digitosAsociar >= 2 && this.digitosAsociar <= 5;
  }

  convertirLetraABinario(letra: string): string {
    const posicion = letra.toUpperCase().charCodeAt(0) - 64; // A=1
    return posicion.toString(2).padStart(5, '0'); // siempre 5 bits
  }

  validarTexto(texto: string): boolean {
    return /^[A-Za-z]$/.test(texto);
  }

  // ========================= GENERAR ESTRUCTURA =========================
  generarEstructura() {
    if (!this.digitosAsociarValido()) return;
    this.raiz = { etiqueta: 'Raíz', hijos: [] };
    this.letrasInsertadas = [];
    this.mostrarArbol = true;
    this.resultado = 'Estructura generada con ' + this.digitosAsociar + ' dígitos asociados';
    this.construirNiveles(this.raiz, 0);
    setTimeout(() => this.actualizarVisualizacion(), 0);
  }

  // Construye todos los nodos posibles del árbol según k dígitos
  construirNiveles(nodo: NodoArbol, nivelBits: number) {
    if (!this.digitosAsociar) return;
    if (nivelBits >= 5) return;

    const bitsRestantes = 5 - nivelBits;
    const grupo = Math.min(this.digitosAsociar, bitsRestantes);
    const totalCombinaciones = Math.pow(2, grupo);

    for (let i = 0; i < totalCombinaciones; i++) {
      const etiqueta = i.toString(2).padStart(grupo, '0');
      const hijo: NodoArbol = { etiqueta, hijos: [] };
      nodo.hijos.push(hijo);
      this.construirNiveles(hijo, nivelBits + grupo);
    }
  }

  // ========================= INSERCIÓN =========================
  anadir() {
    if (!this.ingreso) {
      alert('Ingrese un carácter');
      return;
    }
    if (!this.validarTexto(this.ingreso)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }
    if (!this.raiz) {
      alert('Primero genere la estructura');
      return;
    }

    const letra = this.ingreso.toUpperCase();
    if (this.letrasInsertadas.some(l => l.letra === letra)) {
      this.resultado = `El carácter '${letra}' ya existe`;
      this.ingreso = '';
      return;
    }

    const binario = this.convertirLetraABinario(letra);
    this.insertarEnArbol(letra, binario);
    this.letrasInsertadas.push({ letra, binario });

    this.resultado = `Carácter '${letra}' insertado correctamente`;
    this.ingreso = '';
    this.actualizarVisualizacion('highlight', letra);
  }

  insertarEnArbol(letra: string, binario: string) {
    if (!this.raiz || !this.digitosAsociar) return;

    const bloques: string[] = [];
    for (let i = 0; i < 5; i += this.digitosAsociar) {
      const parte = binario.slice(i, i + this.digitosAsociar);
      bloques.push(parte);
    }

    let actual = this.raiz;
    for (const bloque of bloques) {
      const hijo = actual.hijos.find(h => h.etiqueta === bloque);
      if (!hijo) return; // debería existir siempre
      actual = hijo;
    }
    actual.letra = letra;
  }

  // ========================= BÚSQUEDA =========================
  buscar() {
    if (!this.busqueda) {
      alert('Ingrese un carácter');
      return;
    }
    if (!this.validarTexto(this.busqueda)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }
    if (!this.raiz) {
      alert('Primero genere la estructura');
      return;
    }

    const letra = this.busqueda.toUpperCase();
    const binario = this.convertirLetraABinario(letra);
    const encontrada = this.buscarEnArbol(letra, binario);

    this.resultado = encontrada
      ? `Carácter '${letra}' encontrado`
      : `Carácter '${letra}' no encontrado`;
    this.busqueda = '';
    this.actualizarVisualizacion(encontrada ? 'highlight' : 'notfound', letra);
  }

  buscarEnArbol(letra: string, binario: string): boolean {
    if (!this.raiz || !this.digitosAsociar) return false;

    const bloques: string[] = [];
    for (let i = 0; i < 5; i += this.digitosAsociar) {
      const parte = binario.slice(i, i + this.digitosAsociar);
      bloques.push(parte);
    }

    let actual = this.raiz;
    for (const bloque of bloques) {
      const hijo = actual.hijos.find(h => h.etiqueta === bloque);
      if (!hijo) return false;
      actual = hijo;
    }
    return actual.letra === letra;
  }

  // ========================= ELIMINAR =========================
  eliminar() {
    if (!this.retiro) {
      alert('Ingrese un carácter a eliminar');
      return;
    }
    if (!this.validarTexto(this.retiro)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }
    if (!this.raiz) {
      alert('Primero genere la estructura');
      return;
    }

    const letra = this.retiro.toUpperCase();
    const binario = this.convertirLetraABinario(letra);
    const bloques: string[] = [];
    for (let i = 0; i < 5; i += this.digitosAsociar!) {
      bloques.push(binario.slice(i, i + this.digitosAsociar!));
    }

    let actual = this.raiz;
    for (const bloque of bloques) {
      const hijo = actual.hijos.find(h => h.etiqueta === bloque);
      if (!hijo) {
        this.resultado = `Carácter '${letra}' no encontrado`;
        return;
      }
      actual = hijo;
    }

    if (actual.letra === letra) {
      delete actual.letra;
      this.letrasInsertadas = this.letrasInsertadas.filter(l => l.letra !== letra);
      this.resultado = `Carácter '${letra}' eliminado`;
      this.actualizarVisualizacion();
    } else {
      this.resultado = `Carácter '${letra}' no encontrado`;
    }
    this.retiro = '';
  }

  // ========================= VISUALIZACIÓN =========================
  actualizarVisualizacion(accion: 'highlight' | 'notfound' | null = null, letra?: string) {
    if (!this.networkContainer || !this.raiz) return;

    const nodes: any[] = [];
    const edges: any[] = [];
    let contador = 0;

    const recorrer = (nodo: NodoArbol, idPadre: number | null) => {
      const id = contador++;
      const color =
        nodo.etiqueta === 'Raíz'
          ? '#FFCC80'
          : nodo.letra
          ? accion === 'highlight' && letra === nodo.letra
            ? '#4FC3F7'
            : '#8BC34A'
          : '#FFF9C4';

      const label =
        nodo.etiqueta === 'Raíz'
          ? 'Raíz'
          : nodo.letra
          ? `${nodo.etiqueta}\n(${nodo.letra})`
          : nodo.etiqueta;

      nodes.push({ id, label, color });
      if (idPadre !== null) edges.push({ from: idPadre, to: id });
      nodo.hijos.forEach(h => recorrer(h, id));
    };

    recorrer(this.raiz, null);

    const data = { nodes: new DataSet(nodes), edges: new DataSet(edges) };
    const options = {
      layout: { hierarchical: { direction: 'UD', sortMethod: 'directed' } },
      nodes: { shape: 'circle', font: { color: '#000', size: 14 } },
      edges: { arrows: 'to', color: '#9E9E9E' },
      physics: false
    };

    if (this.network) this.network.destroy();
    this.network = new Network(this.networkContainer.nativeElement, data, options);
  }

  // ========================= EXPORTAR / IMPORTAR =========================
  exportarJSON() {
    if (!this.raiz || !this.digitosAsociar) return;
    const data = {
      tipoEstructura: 'busqueda-residuos-multiples',
      digitosAsociar: this.digitosAsociar,
      letras: this.letrasInsertadas
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'busqueda_residuos_multiples.json';
    link.click();
  }

  importarJSON(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (
          json.tipoEstructura !== 'busqueda-residuos-multiples' ||
          !json.digitosAsociar ||
          !Array.isArray(json.letras)
        ) {
          alert('JSON no válido para este algoritmo.');
          return;
        }

        this.digitosAsociar = json.digitosAsociar;
        this.raiz = { etiqueta: 'Raíz', hijos: [] };
        this.construirNiveles(this.raiz, 0);
        this.letrasInsertadas = json.letras;
        for (const { letra, binario } of this.letrasInsertadas) {
          this.insertarEnArbol(letra, binario);
        }
        this.mostrarArbol = true;
        this.resultado = 'Estructura cargada correctamente';
        setTimeout(() => this.actualizarVisualizacion(), 0);
      } catch {
        alert('Error al leer el JSON');
      }
    };
    reader.readAsText(file);
  }
}
