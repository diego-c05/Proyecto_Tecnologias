import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Materias } from '../../../services/materia/materias';
import { ConfirmDialogComponent } from '../../../Confirm/confirm-dialog.ts/confirm-dialog.ts';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-listarmaterias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarmaterias.html',
  styleUrl: './listarmaterias.css'
})
export class ListarMaterias implements OnInit, OnDestroy {

  materias: any[] = [];
  cargando = true;

  private sub!: Subscription;

  constructor(private materiasService: Materias,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  //Detectar cambio
  async cargarMaterias() {
    this.cargando = true;
    this.materias = await this.materiasService.listarMaterias();
    this.cargando = false;
    this.cdr.detectChanges();
  }

  //Cuando inicializa la pagina
  async ngOnInit() {
    await this.cargarMaterias();

    this.sub = this.materiasService.refrescar$.subscribe(() => {
      this.cargarMaterias();
    });
  }

  async eliminarMateria(id: string) {
    if (!id) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Seguro que quieres eliminar esta Materia?' }
    });

    const ok = await firstValueFrom(ref.afterClosed());
    if (!ok) return;

    try {
      await this.materiasService.eliminarMateria(id);
      this.showMsg('Materia eliminada');
    } catch (err) {
      console.error('Error eliminando:', err);
      this.showMsg('No se pudo eliminar la Materia.');
    }

  }

  private showMsg(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  editMateria(materia: any) {
    this.materiasService.editarMateria(materia);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
