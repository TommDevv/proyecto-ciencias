import { Component } from '@angular/core';


interface NodoArbol {
  valor: string | null;
  finDePalabra: boolean;
  hijos: { [clave: string]: NodoArbol };
}

@Component({
  selector: 'app-arbol-digital',
  templateUrl: './arbol-digital.component.html',
  styleUrls: ['./arbol-digital.component.css']
})


export class ArbolDigitalComponent {
   raiz: NodoArbol;
  ingreso: string = '';
  busqueda: string = '';
  retiro: string = '';
  resultado: string = '';
  mostrarArbol: boolean = false;

  constructor() {
    this.raiz = this.crearNodo(null);
  }

  crearNodo(valor: string | null): NodoArbol {
    return {
      valor,
      finDePalabra: false,
      hijos: {}
    };
  }

  generarEstructura() {
    this.raiz = this.crearNodo(null);
    this.mostrarArbol = true;
    this.resultado = 'Estructura inicializada';
  }

  anadir(): void {
    if (!this.ingreso) {
      alert('Ingrese una clave');
      return;
    }

    let nodoActual = this.raiz;
    for (const char of this.ingreso) {
      if (!nodoActual.hijos[char]) {
        nodoActual.hijos[char] = this.crearNodo(char);
      }
      nodoActual = nodoActual.hijos[char];
    }
    nodoActual.finDePalabra = true;
    this.resultado = `Clave '${this.ingreso}' añadida correctamente`;
    this.ingreso = '';
  }

  buscar(): void {
    if (!this.busqueda) {
      alert('Ingrese una clave a buscar');
      return;
    }

    let nodoActual = this.raiz;
    for (const char of this.busqueda) {
      if (!nodoActual.hijos[char]) {
        this.resultado = `Clave '${this.busqueda}' no encontrada`;
        return;
      }
      nodoActual = nodoActual.hijos[char];
    }

    this.resultado = nodoActual.finDePalabra
      ? `Clave '${this.busqueda}' encontrada`
      : `Clave '${this.busqueda}' no completa`;
    this.busqueda = '';
  }

  eliminar(): void {
    if (!this.retiro) {
      alert('Ingrese una clave a eliminar');
      return;
    }

    const eliminado = this.eliminarRecursivo(this.raiz, this.retiro, 0);
    this.resultado = eliminado
      ? `Clave '${this.retiro}' eliminada`
      : `Clave '${this.retiro}' no encontrada`;
    this.retiro = '';
  }

  eliminarRecursivo(nodo: NodoArbol, clave: string, index: number): boolean {
    if (index === clave.length) {
      if (!nodo.finDePalabra) return false;
      nodo.finDePalabra = false;
      return Object.keys(nodo.hijos).length === 0;
    }

    const char = clave[index];
    const hijo = nodo.hijos[char];
    if (!hijo) return false;

    const debeEliminar = this.eliminarRecursivo(hijo, clave, index + 1);
    if (debeEliminar) {
      delete nodo.hijos[char];
      return Object.keys(nodo.hijos).length === 0 && !nodo.finDePalabra;
    }

    return false;
  }

  exportarJSON(): void {
    const exportData = {
      tipoEstructura: 'digital',
      arbol: this.raiz
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "estructura_digital.json");
    dlAnchor.click();
  }

  importarJSON(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.tipoEstructura !== 'digital') {
          alert('El JSON no corresponde a una estructura de tipo "digital".');
          return;
        }
        this.raiz = json.arbol;
        this.mostrarArbol = true;
        this.resultado = 'Estructura cargada correctamente';
      } catch (err) {
        alert('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
  }
}
