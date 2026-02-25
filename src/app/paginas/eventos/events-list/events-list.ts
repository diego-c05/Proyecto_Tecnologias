import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';
import { Materias } from '../../../services/materia/materias';
import { combineLatest, Subscription } from 'rxjs';

interface EventoView extends Evento {
  materiaNombre?: string;
  materiaCodigo?: string;
  materiaSeccion?: string;
}

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-list.html',
  styleUrls: ['./events-list.css']
})
export class EventsList implements OnInit {

  events: EventoView[] = [];
  private sub!: Subscription;

  constructor(private eventsService: EventsService, private materiasService: Materias) {}

async ngOnInit() {
  try {
    this.sub = combineLatest([
      this.eventsService.getEvents(),            // 🔥 ya reactivo
      this.materiasService.getMateriasRealtime() // 🔥 nuevo
    ]).subscribe(([events, materias]) => {
      this.events = events.map(event => {
        const materia = materias.find(m => m.id === event.materiaId);
        return {
          ...event,
          materiaNombre: materia?.nombre ?? null,
          materiaCodigo: materia?.codigo ?? null,
          materiaSeccion: materia?.seccion ?? null
        };
      });
    });
  } catch (err) {
    console.error('ERROR LISTANDO EVENTS (getDocs) =>', err);
  }
}

  async deleteEvent(id?: string) {
  if (!id) return;

  if (confirm('¿Seguro que quieres eliminar este evento?')) {
    try {
      await this.eventsService.deleteEvent(id);
      
      this.events = this.events.filter(e => e.id !== id);
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  }
}

}

