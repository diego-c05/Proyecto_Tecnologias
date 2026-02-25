import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscripcionesService, Inscripcion, EstadoInscripcion } from '../../../services/inscripciones.service';
import { AuthService } from '../../../services/auth.service';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-admin-inscripciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admi-inscripciones.html',
  styleUrls: ['./admi-inscripciones.css'],
})
export class AdminInscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  cargando = true;

  constructor(private inscripcionesService: InscripcionesService,
    private authService: AuthService,
    private eventService: EventsService
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
      await this.cargar(); // ✅ refresca pantalla
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el estado.');
    }
  }

  async eliminar(i: any) {
    if (!i.id) return;
    if (!confirm('¿Eliminar esta inscripción?')) return;

    try {
      await this.inscripcionesService.eliminarInscripcion(i.id);
      await this.cargar(); // ✅ refresca pantalla
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar.');
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

}
