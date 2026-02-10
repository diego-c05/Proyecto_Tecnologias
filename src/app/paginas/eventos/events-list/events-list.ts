import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-list.html',
  styleUrls: ['./events-list.css']
})
export class EventsList implements OnInit {

  events: Evento[] = [];

  constructor(private eventsService: EventsService) {}

async ngOnInit() {
  try {
    const data = await this.eventsService.listEvents();
    console.log('EVENTS (getDocs) =>', data);
    this.events = data;
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

