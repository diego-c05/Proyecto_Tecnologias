import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventsService, Evento } from '../../../services/events.service';
import { Materias } from '../../../services/materia/materias';
import { UsuariosService,Usuario } from '../../../services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
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
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
  private snackBar: MatSnackBar
  ) { }

  materias: any[] = [];
  coordinadores: Usuario[] = [];

  imagenesDisponibles = [
  { label: 'Predeterminada (Vinculación)', url: 'vinculacion-default.jpg' },
  { label: 'Reforestación', url: 'vinculacion-default3.png' },
  { label: 'Comunidad', url: 'vinculacion-default1.png' },
];

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');

    this.materias = await this.materiasService.listarMaterias();

    const usuarios = await this.usuariosService.listarUsuarios();
    this.coordinadores = usuarios.filter(u=>u.rol === 'coordinador')

    if (this.eventId) {
      const data = await this.eventsService.getEventById(this.eventId);
      if (data) {
        this.event = data;
     } else {
  this.showMsg('Evento no encontrado');
  this.router.navigate(['/eventos/events-list']);
}
    }
  }

 async saveEvent(form: NgForm) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
this.event.imageUrl = this.event.imageUrl || 'vinculacion-default.jpg'; 
  try {
    if (this.eventId) {
      await this.eventsService.updateEvent(this.eventId, this.event);
      this.showMsg('Evento actualizado');
    } else {
      await this.eventsService.createEvent(this.event);
     this.showMsg('Evento creado');
    }

    this.router.navigate(['/eventos/events-list']);
  } catch (err) {
    console.error('Error guardando:', err);
    this.showMsg('Ocurrió un error al guardar');
  }
}


  onMateriaChange() {
    const materia = this.materias.find(
      m => m.id === this.event.materiaId
    );

    if (materia) {
      this.event.materiaId = materia.id;
    }
  }

  onCoordinadorChange() {
    const coordinador = this.coordinadores.find(
      c => c.uid === this.event.coordinadorId
    );

    if (coordinador) {
      this.event.coordinadorId = coordinador.uid;
    }
  }

  msg = '';
msgType: 'success' | 'error' | '' = '';

private setMsg(text: string, type: 'success' | 'error') {
  this.msg = text;
  this.msgType = type;
  setTimeout(() => {
    this.msg = '';
    this.msgType = '';
  }, 2500);
}
  private showMsg(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  });
}
}
