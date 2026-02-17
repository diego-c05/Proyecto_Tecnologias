import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-detalle-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-events.html',
  styleUrl: './detalle-events.css',
})
export class DetalleEvents implements OnInit {
  evento: Evento | null = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private inscripcionesService: InscripcionesService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/eventos/vereventos']);
      return;
    }

    try {
      this.evento = await this.eventsService.getEventById(id);
      if (!this.evento) this.router.navigate(['/eventos/vereventos']);
    } catch (err) {
      console.error('Error cargando detalle:', err);
      this.router.navigate(['/eventos/vereventos']);
    } finally {
      this.cargando = false;
    }
  }

  volver() {
    this.router.navigate(['/eventos/vereventos']);
  }

 async inscribirse() {
  if (!this.evento?.id) return;

  const user = this.authService.getCurrentUser();
  if (!user) {
    alert('Debes iniciar sesión para inscribirte.');
    this.router.navigate(['/inicio-sesion']);
    return;
  }

  try {
    await this.inscripcionesService.crearInscripcion({
      eventoId: this.evento.id,
      usuarioId: user.uid,
      estado: 'inscrito',
      usuarioCorreo: user.email ?? 'Sin correo',

      // snapshot 
      eventoNombre: this.evento.name,
      eventoHoras: this.evento.hours,
      eventoFecha: this.evento.date,
      materiaNombre: this.evento.materiaNombre,
      materiaCodigo: this.evento.materiaCodigo,
      materiaSeccion: this.evento.materiaSeccion,
    });

    alert('¡Inscripción registrada!');
  } catch (e: any) {
    alert(e?.message || 'No se pudo inscribir.');
  }
}

  esFinalizado(e: Evento): boolean {
    const hoy = new Date();
    const fechaEvento = new Date(e.date + 'T23:59:59');
    return fechaEvento < hoy;
  }

  formatearFechaCompleta(fecha: string): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    return `${dia} de ${mes}`;
  }
}
