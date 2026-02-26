import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materias } from '../../../services/materia/materias';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

interface Materia {
  id?: string;
  nombre: string;
  codigo: string;
  seccion: string;
}

@Component({
  selector: 'app-crear-materia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './crear-materia.html',
  styleUrl: './crear-materia.css',
})
export class CrearMateria implements OnInit {
  materia: Materia = {
    nombre: '',
    codigo: '',
    seccion: ''
  };

  titulo = "Agregar Materia";

  constructor(private materiasService: Materias,

  private snackBar: MatSnackBar
  ) { }

  //Obtener los datos y colocarlos en el formulario
  ngOnInit(): void {
    this.materiasService.getMateria().subscribe(res => {
      this.titulo = "Editar Materia";
      this.materia = {
        id: res.id,
        nombre: res.nombre,
        codigo: res.codigo,
        seccion: res.seccion
      };
      console.log(res);
    })
  }

  async guardar() {
    try {

      //Si el id no viene vacio se modificaria, si id es vacio se agregaria
      if (this.materia.id) {
        await this.materiasService.actualizarMateria(this.materia.id, {
          nombre: this.materia.nombre,
          codigo: this.materia.codigo,
          seccion: this.materia.seccion
        });

        this.showMsg('Materia actualizada correctamente');
      } else {
        await this.materiasService.insertarMateria({
          ...this.materia
        });
        console.log('✅ Materia insertada');
        this.showMsg('Materia guardada correctamente');
      }

      this.materia = { nombre: '', codigo: '', seccion: '' }; 
      this.titulo = "Agregar Materia"

    } catch (error) {
      console.error('❌ Error al guardar', error);

    this.showMsg('Ocurrió un error al guardar.');
    }
  }

  private showMsg(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  });
}
}
