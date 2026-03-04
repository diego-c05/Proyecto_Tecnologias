import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';
import { Materias } from '../../../services/materia/materias';
import { NotificacionesService, Notificacion } from '../../../services/notificacione.service';
import { AuthService } from '../../../services/auth.service';
import { combineLatest } from 'rxjs';

interface EventoView extends Evento {
  materiaNombre?: string;
  materiaCodigo?: string;
  materiaSeccion?: string;
}

@Component({
  selector: 'app-vereventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vereventos.html',
  styleUrl: './vereventos.css',
})
export class Vereventos implements OnInit {
  eventos: EventoView[] = [];

  // Modal notificaciones
  mostrarModal = false;
  notificaciones: Notificacion[] = [];

  constructor(
    private eventsService: EventsService,
    private materiasService: Materias,
    private notificacionesService: NotificacionesService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Cargar eventos (igual que antes)
    try {
      combineLatest([
        this.eventsService.getEvents(),
        this.materiasService.getMateriasRealtime()
      ]).subscribe(([events, materias]) => {
        const eventosOrdenados = events
          .map(event => {
            const materia = materias.find(m => m.id === event.materiaId);
            return {
              ...event,
              materiaNombre: materia?.nombre ?? null,
              materiaCodigo: materia?.codigo ?? null,
              materiaSeccion: materia?.seccion ?? null
            };
          })
          .sort((a, b) => {
            const aFin = this.esFinalizado(a);
            const bFin = this.esFinalizado(b);
            if (aFin !== bFin) return aFin ? 1 : -1;
            const aTime = new Date(a.date + 'T00:00:00').getTime();
            const bTime = new Date(b.date + 'T00:00:00').getTime();
            return aTime - bTime;
          });
        this.eventos = eventosOrdenados;
      });
    } catch (err) {
      console.error('Error cargando eventos:', err);
    }

    // Verificar notificaciones no leídas
    await this.cargarNotificaciones();
  }

  async cargarNotificaciones() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const noLeidas = await this.notificacionesService.obtenerNoLeidas(user.uid);
    if (noLeidas.length > 0) {
      this.notificaciones = noLeidas;
      this.mostrarModal = true;
    }
  }

  async cerrarModal() {
    const user = this.authService.getCurrentUser();
    if (user) {
      await this.notificacionesService.marcarTodasLeidas(user.uid);
    }
    this.mostrarModal = false;
    this.notificaciones = [];
  }

  formatearFecha(fecha: string): string {
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const date = new Date(fecha + 'T00:00:00');
    return `${date.getDate()} ${meses[date.getMonth()]}`;
  }

  guardarEvento(evento: Evento) {
    localStorage.setItem('eventoSeleccionado', JSON.stringify(evento));
  }

  esFinalizado(e: Evento): boolean {
    const hoy = new Date();
    const fechaEvento = new Date(e.date + 'T23:59:59');
    return fechaEvento < hoy;
  }
}