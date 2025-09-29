import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';

interface NodoHuffman {
  letra: string | null;
  frecuencia: number;
  izquierdo?: NodoHuffman | null;
  derecho?: NodoHuffman | null;
}

interface CodigoHuffman {
  letra: string;
  frecuencia: number;
  codigo: string;
}

@Component({
  selector: 'app-huffman',
  templateUrl: './huffman.component.html',
  styleUrls: ['./huffman.component.css']
})
export class HuffmanComponent {
  @ViewChild('networkContainer', { static: false }) networkContainer!: ElementRef;
  network!: Network;

  palabra: string = '';
  raiz: NodoHuffman | null = null;
  codigos: CodigoHuffman[] = [];
  resultado = '';
  mostrarArbol = false;

  // ========================= Generar Árbol =========================
  generarArbol() {
    const entrada = this.palabra.trim().toUpperCase();
    if (!entrada) {
      alert('Ingrese una palabra válida (sin espacios)');
      return;
    }

    // Calcular frecuencias
    const frecuencias = new Map<string, number>();
    for (const c of entrada) {
      frecuencias.set(c, (frecuencias.get(c) || 0) + 1);
    }

    // Crear nodos iniciales
    let nodos: NodoHuffman[] = [];
    frecuencias.forEach((freq, letra) => {
      nodos.push({ letra, frecuencia: freq });
    });

    // Construir árbol de Huffman
    while (nodos.length > 1) {
      // ordenar por frecuencia
      nodos.sort((a, b) => a.frecuencia - b.frecuencia);

      const n1 = nodos.shift()!;
      const n2 = nodos.shift()!;

      const nuevo: NodoHuffman = {
        letra: null,
        frecuencia: n1.frecuencia + n2.frecuencia,
        izquierdo: n1,
        derecho: n2
      };

      nodos.push(nuevo);
    }

    this.raiz = nodos[0];
    this.codigos = [];
    this.generarCodigos(this.raiz, '');

    this.resultado = 'Árbol generado correctamente';
    this.mostrarArbol = true;
    setTimeout(() => this.actualizarVisualizacion(), 0);
  }

  // Generar códigos recorriendo el árbol
  generarCodigos(nodo: NodoHuffman | null, codigoActual: string) {
    if (!nodo) return;
    if (nodo.letra) {
      this.codigos.push({
        letra: nodo.letra,
        frecuencia: nodo.frecuencia,
        codigo: codigoActual || '0' // si hay solo un símbolo
      });
    }
    this.generarCodigos(nodo.izquierdo || null, codigoActual + '0');
    this.generarCodigos(nodo.derecho || null, codigoActual + '1');
  }

  // ========================= Visualización =========================
  actualizarVisualizacion() {
    if (!this.raiz || !this.networkContainer) return;

    const nodes: any[] = [];
    const edges: any[] = [];
    let contador = 0;

    const recorrer = (nodo: NodoHuffman | null, idPadre: number | null) => {
      if (!nodo) return;
      const id = contador++;
      const color = nodo.letra ? '#8BC34A' : '#FFCC80';
      const label = nodo.letra
        ? `${nodo.letra}\n(${nodo.frecuencia})`
        : `${nodo.frecuencia}`;

      nodes.push({ id, label, color });
      if (idPadre !== null) edges.push({ from: idPadre, to: id });

      recorrer(nodo.izquierdo || null, id);
      recorrer(nodo.derecho || null, id);
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

  // ========================= Exportar / Importar =========================
  exportarJSON() {
    if (!this.raiz) return;
    const data = {
      tipoEstructura: 'huffman',
      palabra: this.palabra,
      codigos: this.codigos
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'arbol_huffman.json';
    link.click();
  }

  importarJSON(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.tipoEstructura !== 'huffman' || !json.palabra) {
          alert('JSON no válido para Huffman.');
          return;
        }

        this.palabra = json.palabra;
        this.codigos = json.codigos || [];
        // reconstrucción completa a partir de la palabra
        this.generarArbol();
        this.resultado = 'Estructura cargada correctamente';
      } catch {
        alert('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
  }
}
