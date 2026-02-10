import { Component } from '@angular/core';
import { CrearMateria } from '../crear-materia/crear-materia';
import { ListarMaterias } from '../listarmaterias/listarmaterias';

@Component({
  selector: 'app-materias-pagina',
  imports: [CrearMateria, ListarMaterias],
  templateUrl: './materias-pagina.html',
  styleUrl: './materias-pagina.css',
})
export class MateriasPagina {

}
