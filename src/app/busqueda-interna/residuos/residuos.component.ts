import { Component } from '@angular/core';

interface NodoResiduo {
  valor: number | null;
  izquierdo: NodoResiduo | null;
  derecho: NodoResiduo | null;
}


@Component({
  selector: 'app-residuos',
  templateUrl: './residuos.component.html',
  styleUrls: ['./residuos.component.css']
})
export class ResiduosComponent {
  raiz: NodoResiduo | null = null;
  ingreso: string = '';
  busqueda: string = '';
  retiro: string = '';
  resultado: string = '';
  mostrarArbol: boolean = false;
  base: number = 3; // puedes cambiar la base aquí

  generarEstructura() {
    this.raiz = null;
    this.mostrarArbol = true;
    this.resultado = 'Estructura inicializada';
  }

  crearNodo(valor: number): NodoResiduo {
    return {
      valor,
      izquierdo: null,
      derecho: null
    };
  }

  anadir(): void {
    if (!this.ingreso) {
      alert('Ingrese una clave');
      return;
    }

    const clave = parseInt(this.ingreso, 10);
    if (isNaN(clave)) {
      alert('Ingrese un número válido');
      return;
    }

    this.raiz = this.insertarNodo(this.raiz, clave);
    this.resultado = `Clave '${clave}' añadida correctamente`;
    this.ingreso = '';
  }

  insertarNodo(nodo: NodoResiduo | null, valor: number): NodoResiduo {
    if (!nodo) return this.crearNodo(valor);

    const residuo = valor % this.base;
    if (residuo === 0) {
      nodo.izquierdo = this.insertarNodo(nodo.izquierdo, valor);
    } else {
      nodo.derecho = this.insertarNodo(nodo.derecho, valor);
    }

    return nodo;
  }

  buscar(): void {
    if (!this.busqueda) {
      alert('Ingrese una clave a buscar');
      return;
    }

    const clave = parseInt(this.busqueda, 10);
    if (isNaN(clave)) {
      alert('Ingrese un número válido');
      return;
    }

    const encontrado = this.buscarNodo(this.raiz, clave);
    this.resultado = encontrado
      ? `Clave '${clave}' encontrada`
      : `Clave '${clave}' no encontrada`;
    this.busqueda = '';
  }

  buscarNodo(nodo: NodoResiduo | null, valor: number): boolean {
    if (!nodo) return false;
    if (nodo.valor === valor) return true;

    const residuo = valor % this.base;
    if (residuo === 0) {
      return this.buscarNodo(nodo.izquierdo, valor);
    } else {
      return this.buscarNodo(nodo.derecho, valor);
    }
  }

  eliminar(): void {
    if (!this.retiro) {
      alert('Ingrese una clave a eliminar');
      return;
    }

    const clave = parseInt(this.retiro, 10);
    if (isNaN(clave)) {
      alert('Ingrese un número válido');
      return;
    }

    const [nuevoRaiz, eliminado] = this.eliminarNodo(this.raiz, clave);
    this.raiz = nuevoRaiz;
    this.resultado = eliminado
      ? `Clave '${clave}' eliminada`
      : `Clave '${clave}' no encontrada`;
    this.retiro = '';
  }

  eliminarNodo(nodo: NodoResiduo | null, valor: number): [NodoResiduo | null, boolean] {
    if (!nodo) return [null, false];

    if (nodo.valor === valor) {
      if (!nodo.izquierdo && !nodo.derecho) return [null, true];
      if (!nodo.izquierdo) return [nodo.derecho, true];
      if (!nodo.derecho) return [nodo.izquierdo, true];

      let sucesor = nodo.derecho;
      while (sucesor.izquierdo) sucesor = sucesor.izquierdo;
      nodo.valor = sucesor.valor;
      const [nuevoDerecho] = this.eliminarNodo(nodo.derecho, sucesor.valor!);
      nodo.derecho = nuevoDerecho;
      return [nodo, true];
    }

    const residuo = valor % this.base;
    if (residuo === 0) {
      const [nuevoIzquierdo, eliminado] = this.eliminarNodo(nodo.izquierdo, valor);
      nodo.izquierdo = nuevoIzquierdo;
      return [nodo, eliminado];
    } else {
      const [nuevoDerecho, eliminado] = this.eliminarNodo(nodo.derecho, valor);
      nodo.derecho = nuevoDerecho;
      return [nodo, eliminado];
    }
  }

  exportarJSON(): void {
    const exportData = {
      tipoEstructura: 'residuo',
      base: this.base,
      arbol: this.raiz
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "estructura_residuo.json");
    dlAnchor.click();
  }

  importarJSON(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json.tipoEstructura !== 'residuo') {
          alert('El JSON no corresponde a una estructura de tipo "residuo".');
          return;
        }
        this.raiz = json.arbol;
        this.base = json.base || 3;
        this.mostrarArbol = true;
        this.resultado = 'Estructura cargada correctamente';
      } catch (err) {
        alert('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
  }
}
