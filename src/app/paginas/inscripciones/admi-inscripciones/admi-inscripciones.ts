import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesService, Inscripcion, EstadoInscripcion } from '../../../services/inscripciones.service';
import { AuthService } from '../../../services/auth.service';
import { EventsService } from '../../../services/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Confirm/confirm-dialog.ts/confirm-dialog.ts';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-inscripciones',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './admi-inscripciones.html',
  styleUrls: ['./admi-inscripciones.css'],
})
export class AdminInscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  cargando = true;

  constructor(private inscripcionesService: InscripcionesService,
    private authService: AuthService,
    private eventService: EventsService,
    private snackBar: MatSnackBar,

  private dialog: MatDialog
  ) { }

  // dentro de AdminInscripcionesComponent
  inscripcionesPorEvento: { eventoId: string; eventoNombre: string; lista: any[] }[] = [];

  async ngOnInit() {
    await this.cargar();

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.cargando = true;

    try {
      
      const eventos = await this.eventService.listarEventosPorCoordinador(user.uid);

      const inscripciones = await this.inscripcionesService.listarInscripciones();    

      const map = new Map<string, any>();

      for (const e of eventos) {
        map.set(e.id!, {
          eventoId: e.id,
          eventoNombre: e.name,
          lista: [],
        });
      }

      for (const i of inscripciones) {
        if (map.has(i.eventoId)) {
          map.get(i.eventoId).lista.push(i);
        }
      }


      this.inscripcionesPorEvento = Array.from(map.values());

    } catch (err) {
      console.error(err);
    }
  }

  async cambiarEstado(i: any, estado: any) {
    if (!i.id) return;
    try {
      await this.inscripcionesService.actualizarInscripcion(i.id, { estado });
      this.showMsg('Estado actualizado');
      await this.cargar(); // refresca pantalla
    } catch (err) {
      console.error(err);
        this.showMsg('No se pudo actualizar el estado.');
    }
  }

async eliminar(i: any) {
  if (!i.id) return;

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: '¿Eliminar esta inscripción?' }
  });

  const confirmado = await firstValueFrom(dialogRef.afterClosed());
  if (!confirmado) return;

  try {
    await this.inscripcionesService.eliminarInscripcion(i.id);
    this.showMsg('Inscripción eliminada');
    await this.cargar();
  } catch (err) {
    console.error(err);
    this.showMsg('No se pudo eliminar.');
  }
}

  async cargar() {
    this.cargando = true;
    try {
      const data = await this.inscripcionesService.listarInscripciones();

      const map = new Map<string, any>();
      for (const i of data) {
        const key = i.eventoId;
        if (!map.has(key)) {
          map.set(key, { eventoId: key, eventoNombre: i.eventoNombre || key, lista: [] });
        }
        map.get(key).lista.push(i);
      }

      this.inscripcionesPorEvento = Array.from(map.values());
    } catch (err) {
      console.error(err);
    } finally {
      this.cargando = false;
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
