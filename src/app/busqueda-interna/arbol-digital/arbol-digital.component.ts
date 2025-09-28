import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';

interface NodoArbol {
  letra: string;
  binario: string;
  izquierdo: NodoArbol | null;
  derecho: NodoArbol | null;
}

@Component({
  selector: 'app-arbol-digital',
  templateUrl: './arbol-digital.component.html',
  styleUrls: ['./arbol-digital.component.css']
})
export class ArbolDigitalComponent {
  raiz: NodoArbol | null = null;
  ingreso: string = '';
  busqueda: string = '';
  retiro: string = '';
  resultado: string = '';
  mostrarArbol: boolean = false;

  letrasInsertadas: { letra: string; binario: string }[] = [];

  @ViewChild('networkContainer', { static: false }) networkContainer!: ElementRef;
  network!: Network;

  convertirLetraABinario(letra: string): string {
    const posicion = letra.toUpperCase().charCodeAt(0) - 64;
    return posicion.toString(2).padStart(5, '0');
  }

  validarTexto(texto: string): boolean {
    return /^[A-Za-z]$/.test(texto);
  }

  generarEstructura() {
    this.raiz = null;
    this.letrasInsertadas = [];
    this.mostrarArbol = true;
    this.resultado = 'Estructura inicializada';
    setTimeout(() => this.actualizarVisualizacion(), 0);
  }

  crearNodo(letra: string, binario: string): NodoArbol {
    return { letra, binario, izquierdo: null, derecho: null };
  }

  insertar(letra: string, binario: string) {
    if (!this.raiz) {
      this.raiz = this.crearNodo(letra, binario);
      return;
    }

    let actual = this.raiz;
    let i = 0;
    while (i < binario.length) {
      if (binario[i] === '0') {
        if (!actual.izquierdo) {
          actual.izquierdo = this.crearNodo(letra, binario);
          return;
        } else {
          actual = actual.izquierdo;
          i++;
        }
      } else {
        if (!actual.derecho) {
          actual.derecho = this.crearNodo(letra, binario);
          return;
        } else {
          actual = actual.derecho;
          i++;
        }
      }
    }
  }

  anadir() {
    if (!this.ingreso) {
      alert('Ingrese un carácter');
      return;
    }
    if (!this.validarTexto(this.ingreso)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }

    const letra = this.ingreso.toUpperCase();
    const binario = this.convertirLetraABinario(letra);

    // Evitar duplicados
    if (this.letrasInsertadas.some(l => l.letra === letra)) {
      this.resultado = `El carácter '${letra}' ya existe`;
      this.ingreso = '';
      return;
    }

    this.insertar(letra, binario);
    this.letrasInsertadas.push({ letra, binario });

    this.resultado = `Carácter '${letra}' añadido correctamente`;
    this.ingreso = '';
    this.actualizarVisualizacion();
  }

  buscarNodo(letra: string, binario: string): boolean {
    let actual = this.raiz;
    let i = 0;
    while (actual && i < binario.length) {
      if (actual.letra === letra) return true;
      actual = binario[i] === '0' ? actual.izquierdo : actual.derecho;
      i++;
    }
    return actual?.letra === letra;
  }

  buscar() {
    if (!this.busqueda) {
      alert('Ingrese un carácter');
      return;
    }
    if (!this.validarTexto(this.busqueda)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }

    const letra = this.busqueda.toUpperCase();
    const binario = this.convertirLetraABinario(letra);
    const encontrada = this.buscarNodo(letra, binario);

    this.resultado = encontrada
      ? `Carácter '${letra}' encontrado`
      : `Carácter '${letra}' no encontrado`;

    this.busqueda = '';
    this.actualizarVisualizacion(encontrada ? 'highlight' : 'notfound', letra);
  }

  eliminar() {
    if (!this.retiro) {
      alert('Ingrese un carácter a eliminar');
      return;
    }
    if (!this.validarTexto(this.retiro)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }

    const letra = this.retiro.toUpperCase();
    const existe = this.letrasInsertadas.some(l => l.letra === letra);

    if (!existe) {
      this.resultado = `Carácter '${letra}' no encontrado`;
      this.retiro = '';
      return;
    }

    // Quitar la letra de la lista
    this.letrasInsertadas = this.letrasInsertadas.filter(l => l.letra !== letra);

    // Reacomodar todo el árbol
    this.raiz = null;
    for (const { letra: l, binario } of this.letrasInsertadas) {
      this.insertar(l, binario);
    }

    this.resultado = `Carácter '${letra}' eliminado y árbol reacomodado`;
    this.retiro = '';
    this.actualizarVisualizacion();
  }

  actualizarVisualizacion(accion: 'highlight' | 'notfound' | null = null, letra?: string) {
    if (!this.networkContainer) return;

    const nodes: any[] = [];
    const edges: any[] = [];
    let contador = 0;

    const recorrer = (nodo: NodoArbol | null, idPadre: number | null) => {
      if (!nodo) return;

      const id = contador++;
      const color =
        accion === 'highlight' && letra === nodo.letra
          ? '#4FC3F7'
          : '#8BC34A';

      nodes.push({
        id,
        label: `${nodo.letra}\n${nodo.binario}`,
        color
      });

      if (idPadre !== null) {
        edges.push({ from: idPadre, to: id });
      }

      recorrer(nodo.izquierdo, id);
      recorrer(nodo.derecho, id);
    };

    recorrer(this.raiz, null);

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges)
    };

    const options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed'
        }
      },
      nodes: {
        shape: 'circle',
        font: { color: '#000', size: 14 }
      },
      edges: {
        arrows: 'to',
        color: '#9E9E9E'
      },
      physics: false
    };

    if (this.network) this.network.destroy();
    this.network = new Network(this.networkContainer.nativeElement, data, options);
  }

  exportarJSON(): void {
    const exportData = {
      tipoEstructura: 'digital-binario',
      letras: this.letrasInsertadas
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'estructura_digital_binaria.json');
    dlAnchor.click();
  }

  importarJSON(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.tipoEstructura !== 'digital-binario' || !Array.isArray(json.letras)) {
          alert('El JSON no corresponde a una estructura válida.');
          return;
        }
        this.letrasInsertadas = json.letras;
        this.raiz = null;
        for (const { letra, binario } of this.letrasInsertadas) {
          this.insertar(letra, binario);
        }
        this.mostrarArbol = true;
        this.resultado = 'Estructura cargada correctamente';
        setTimeout(() => this.actualizarVisualizacion(), 0);
      } catch {
        alert('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
  }
}
