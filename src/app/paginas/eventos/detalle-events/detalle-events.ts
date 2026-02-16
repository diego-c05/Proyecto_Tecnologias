import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';

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
    private eventsService: EventsService
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

  inscribirse() {
    alert('¡Inscripción registrada! (Aquí luego conectas Firestore para guardar la inscripción)');
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
