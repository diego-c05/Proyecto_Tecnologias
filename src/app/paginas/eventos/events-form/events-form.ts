import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';
import { Materias } from '../../../services/materia/materias';

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
    private materiasService: Materias,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  materias: any[] = [];

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');

    this.materias = await this.materiasService.listarMaterias();

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

 async saveEvent(form: NgForm) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  try {
    if (this.eventId) {
      await this.eventsService.updateEvent(this.eventId, this.event);
      alert('Evento actualizado');
    } else {
      await this.eventsService.createEvent(this.event);
      alert('Evento creado');
    }

    this.router.navigate(['/eventos/events-list']);
  } catch (err) {
    console.error('Error guardando:', err);
    alert('Ocurrió un error');
  }
}


  onMateriaChange() {
    const materia = this.materias.find(
      m => m.id === this.event.materiaId
    );

    if (materia) {
      this.event.materiaNombre = materia.nombre;
      this.event.materiaCodigo = materia.codigo;
      this.event.materiaSeccion = materia.seccion;
    }
  }
}
