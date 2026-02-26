import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InscripcionesService, Inscripcion } from '../../../services/inscripciones.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Confirm/confirm-dialog.ts/confirm-dialog.ts';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule, MatDialogModule],
  templateUrl: './mis-inscripciones.html',
  styleUrls: ['./mis-inscripciones.css'],
})
export class MisInscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  cargando = true;

  constructor(
    private inscripcionesService: InscripcionesService,
    private authService: AuthService,
  private snackBar: MatSnackBar,

  private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.cargando = false;
      return;
    }

    try {
      const data = await this.inscripcionesService.listarPorUsuario(user.uid);

      // Orden
      const peso = (e: Inscripcion) =>
        e.estado === 'inscrito' ? 0 : e.estado === 'asistio' ? 1 : e.estado === 'acreditado' ? 2 : 3;

      this.inscripciones = data.sort((a, b) => {
        const pa = peso(a);
        const pb = peso(b);
        if (pa !== pb) return pa - pb;
        return (a.eventoFecha || '').localeCompare(b.eventoFecha || '');
      });
    } catch (err) {
      console.error('Error cargando inscripciones:', err);
    } finally {
      this.cargando = false;
    }
  }

  async cancelar(i: Inscripcion) {
    if (!i.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Cancelar tu inscripción?' }
    });

    const confirmado = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmado) return;

    try {
      await this.inscripcionesService.cancelarInscripcion(i.id);
      i.estado = 'cancelado';
        this.showMsg('Inscripción cancelada');
    } catch (err) {
      console.error(err);
      this.showMsg('No se pudo cancelar.');
    }
  }

  estadoBonito(e: Inscripcion['estado']) {
    switch (e) {
      case 'inscrito': return 'Inscrito';
      case 'asistio': return 'Asistió';
      case 'acreditado': return 'Acreditado';
      case 'cancelado': return 'Cancelado';
      
      default: return e;
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
