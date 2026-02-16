import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';

@Component({
  selector: 'app-vereventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vereventos.html',
  styleUrl: './vereventos.css',
})
export class Vereventos implements OnInit {

  eventos: Evento[] = [];

  constructor(private eventsService: EventsService) {}

  async ngOnInit() {
  try {
    const data = await this.eventsService.listEvents();

    this.eventos = data.sort((a, b) => {
      const aFin = this.esFinalizado(a);
      const bFin = this.esFinalizado(b);

     
      if (aFin !== bFin) return aFin ? 1 : -1;

     
      const aTime = new Date(a.date + 'T00:00:00').getTime();
      const bTime = new Date(b.date + 'T00:00:00').getTime();
      return aTime - bTime;
    });

    console.log('EVENTOS (estudiante) =>', this.eventos);
  } catch (err) {
    console.error('Error cargando eventos (estudiante):', err);
  }
}


  formatearFecha(fecha: string): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    return `${dia} ${mes}`;
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

