import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events-form.html',
  styleUrls: ['./events-form.css']
})
export class EventsForm {
  event: Evento = {
    name: '',
    date: '',
    location: '',
    description: '',
    hours: 0,
    slots: 0,
    modality: 'Presencial',
    imageUrl: 'vinculacion-default.jpg'
  };

  eventId: string | null = null;

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (this.eventId) {
      const data = await this.eventsService.getEventById(this.eventId);
      if (data) {
        this.event = data; 
      } else {
        alert('Evento no encontrado');
        this.router.navigate(['/eventos/events-list']);
      }
    }
  }

  async saveEvent() {
    try {
      if (this.eventId) {
        // EDITAR
        await this.eventsService.updateEvent(this.eventId, this.event);
        alert('Evento actualizado');
      } else {
        // CREAR
        await this.eventsService.createEvent(this.event);
        alert('Evento creado');
      }

      this.router.navigate(['/eventos/events-list']);
    } catch (err) {
      console.error('Error guardando:', err);
      alert('Ocurrió un error');
    }
  }
}
