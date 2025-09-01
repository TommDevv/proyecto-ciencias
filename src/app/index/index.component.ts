import { Component } from '@angular/core';
import { AppHeaderComponent } from '../app-header/app-header.component';

export interface routes{ 
  titulo: string;
  ruta: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent {

}
