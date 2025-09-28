import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSet, Network } from 'vis-network/standalone';

interface NodoArbol {
  letra: string | null;        // null => nodo de enlace
  binario: string | null;      // solo tiene valor si es hoja (letra != null)
  izquierdo: NodoArbol | null;
  derecho: NodoArbol | null;
}

@Component({
  selector: 'app-busqueda-residuos',
  templateUrl: './residuos.component.html',
  styleUrls: ['./residuos.component.css']
})
export class ResiduosComponent {
  raiz: NodoArbol | null = null; // raíz siempre nodo de enlace
  ingreso = '';
  busqueda = '';
  retiro = '';
  resultado = '';
  mostrarArbol = false;

  // Mantiene el orden de inserción
  letrasInsertadas: { letra: string; binario: string }[] = [];

  @ViewChild('networkContainer', { static: false }) networkContainer!: ElementRef;
  network!: Network;

  // ===== Utilidades de datos =====
  convertirLetraABinario(letra: string): string {
    const posicion = letra.toUpperCase().charCodeAt(0) - 64; // A=1
    return posicion.toString(2).padStart(5, '0');            // 5 bits
  }

  validarTexto(texto: string): boolean {
    return /^[A-Za-z]$/.test(texto);
  }

  crearNodoEnlace(): NodoArbol {
    return { letra: null, binario: null, izquierdo: null, derecho: null };
  }

  crearNodoHoja(letra: string, binario: string): NodoArbol {
    return { letra, binario, izquierdo: null, derecho: null };
  }

  // ===== Ciclo de vida / UI =====
  generarEstructura(): void {
    this.raiz = this.crearNodoEnlace();
    this.letrasInsertadas = [];
    this.mostrarArbol = true;
    this.resultado = 'Estructura inicializada';
    setTimeout(() => this.actualizarVisualizacion(), 0);
  }

  anadir(): void {
    if (!this.ingreso) {
      alert('Ingrese un carácter');
      return;
    }
    if (!this.validarTexto(this.ingreso)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }

    const letra = this.ingreso.toUpperCase();
    if (this.letrasInsertadas.some(l => l.letra === letra)) {
      this.resultado = `El carácter '${letra}' ya existe`;
      this.ingreso = '';
      return;
    }

    const binario = this.convertirLetraABinario(letra);
    this.letrasInsertadas.push({ letra, binario });
    this.reconstruirDesdeLista();

    this.resultado = `Carácter '${letra}' añadido correctamente`;
    this.ingreso = '';
    this.actualizarVisualizacion('highlight', letra);
  }

  buscar(): void {
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

  eliminar(): void {
    if (!this.retiro) {
      alert('Ingrese un carácter a eliminar');
      return;
    }
    if (!this.validarTexto(this.retiro)) {
      alert('Solo se permite un carácter A-Z');
      return;
    }

    const letra = this.retiro.toUpperCase();
    const antes = this.letrasInsertadas.length;
    this.letrasInsertadas = this.letrasInsertadas.filter(l => l.letra !== letra);

    if (this.letrasInsertadas.length === antes) {
      this.resultado = `Carácter '${letra}' no encontrado`;
      this.retiro = '';
      return;
    }

    this.reconstruirDesdeLista();
    this.resultado = `Carácter '${letra}' eliminado y árbol reacomodado`;
    this.retiro = '';
    this.actualizarVisualizacion();
  }

  // ===== Núcleo del algoritmo =====
  // Siempre reconstruye desde el orden de inserción, aplicando inserción con división (split).
  private reconstruirDesdeLista(): void {
    this.raiz = this.crearNodoEnlace();
    for (const { letra, binario } of this.letrasInsertadas) {
      this.insertarConSplit(this.raiz, letra, binario, 0);
    }
  }

  /**
   * Inserta en un subárbol cuyo nodo actual es "enlace" (letra === null).
   * Si el hijo correspondiente es hoja y colisiona, convierte ese hijo en enlace
   * y re-inserta tanto la letra existente como la nueva, avanzando en el siguiente bit.
   */
  private insertarConSplit(nodo: NodoArbol, letra: string, binario: string, idx: number): void {
    // Aseguramos que el nodo actual sea de enlace (por contrato de reconstrucción)
    if (nodo.letra !== null) {
      // Si llegamos aquí por error, convertimos a enlace (no debería ocurrir en reconstrucción)
      nodo.letra = null;
      nodo.binario = null;
      nodo.izquierdo = null;
      nodo.derecho = null;
    }

    // Si agotamos bits, insertamos como hoja en alguna rama libre por convención (izquierda).
    // Con 5 bits y estructura binaria, normalmente no se agotan sin ubicar la hoja.
    if (idx >= binario.length) {
      if (!nodo.izquierdo) {
        nodo.izquierdo = this.crearNodoHoja(letra, binario);
        return;
      }
      if (!nodo.derecho) {
        nodo.derecho = this.crearNodoHoja(letra, binario);
        return;
      }
      // Si ambas ocupadas, promovemos (split) la izquierda y seguimos.
      const hijo = nodo.izquierdo!;
      const oldL = hijo.letra!;
      const oldB = hijo.binario!;
      // Convertir en enlace
      hijo.letra = null; hijo.binario = null; hijo.izquierdo = null; hijo.derecho = null;
      // Reinsertar ambos en el siguiente nivel "forzado"
      this.insertarConSplit(hijo, oldL, oldB, idx + 1);
      this.insertarConSplit(hijo, letra, binario, idx + 1);
      return;
    }

    const bit = binario[idx];
    const dir = bit === '0' ? 'izquierdo' : 'derecho';

    // Rama vacía: insertar hoja aquí
    if (!nodo[dir]) {
      nodo[dir] = this.crearNodoHoja(letra, binario);
      return;
    }

    // Hay algo en la rama: puede ser enlace o hoja
    const child = nodo[dir]!;
    if (child.letra === null) {
      // Enlace → descender con siguiente bit
      this.insertarConSplit(child, letra, binario, idx + 1);
      return;
    }

    // Hoja → colisión. Convertir este hijo en enlace y reinsertar ambas letras más profundo.
    const oldLetter = child.letra;
    const oldBinary = child.binario!;
    // Convertir en enlace limpio
    child.letra = null;
    child.binario = null;
    child.izquierdo = null;
    child.derecho = null;

    // Reinsertar primero la letra existente, luego la nueva, avanzando en el siguiente bit
    this.insertarConSplit(child, oldLetter, oldBinary, idx + 1);
    this.insertarConSplit(child, letra, binario, idx + 1);
  }

  private buscarNodo(letra: string, binario: string): boolean {
    if (!this.raiz) return false;
    let actual: NodoArbol | null = this.raiz;
    let i = 0;

    while (actual) {
      if (actual.letra === letra) return true; // hoja con la letra
      // Si es enlace, seguimos el siguiente bit
      if (actual.letra === null) {
        if (i >= binario.length) return false;
        const bit = binario[i++];
        actual = bit === '0' ? actual.izquierdo : actual.derecho;
      } else {
        // Es hoja pero de otra letra
        return false;
      }
    }
    return false;
  }

  // ===== Visualización con vis-network =====
  actualizarVisualizacion(accion: 'highlight' | 'notfound' | null = null, letra?: string): void {
    if (!this.networkContainer) return;

    const nodes: any[] = [];
    const edges: any[] = [];
    let contador = 0;

    const recorrer = (nodo: NodoArbol | null, idPadre: number | null) => {
      if (!nodo) return;

      const id = contador++;
      const isEnlace = nodo.letra === null;
      const color = isEnlace
        ? '#FFCC80'                                 // enlace
        : accion === 'highlight' && letra === nodo.letra
          ? '#4FC3F7'                               // hoja resaltada en búsqueda
          : '#8BC34A';                              // hoja normal

      const label = isEnlace ? 'Enlace' : `${nodo.letra}\n${nodo.binario}`;

      nodes.push({ id, label, color });

      if (idPadre !== null) edges.push({ from: idPadre, to: id });

      recorrer(nodo.izquierdo, id);
      recorrer(nodo.derecho, id);
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

  // ===== Exportar / Importar =====
  exportarJSON(): void {
    const exportData = {
      tipoEstructura: 'busqueda-residuos',
      letras: this.letrasInsertadas   // mantiene orden de inserción
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'busqueda_residuos.json');
    dlAnchor.click();
  }

  importarJSON(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.tipoEstructura !== 'busqueda-residuos' || !Array.isArray(json.letras)) {
          alert('El JSON no corresponde a una estructura válida.');
          return;
        }
        // Validar formato de letras
        for (const it of json.letras) {
          if (!it || typeof it.letra !== 'string' || it.letra.length !== 1) {
            alert('Formato inválido en JSON: cada entrada debe tener una letra de un carácter.');
            return;
          }
        }
        this.letrasInsertadas = json.letras.map((it: any) => ({
          letra: it.letra.toUpperCase(),
          binario: this.convertirLetraABinario(it.letra.toUpperCase())
        }));
        this.reconstruirDesdeLista();

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
