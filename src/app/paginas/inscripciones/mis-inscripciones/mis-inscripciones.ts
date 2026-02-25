import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InscripcionesService, Inscripcion } from '../../../services/inscripciones.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-inscripciones.html',
  styleUrls: ['./mis-inscripciones.css'],
})
export class MisInscripcionesComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  cargando = true;

  constructor(
    private inscripcionesService: InscripcionesService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.cargando = false;
      return;
    }

    try {
      const data = await this.inscripcionesService.listarPorUsuario(user.uid);

      // Orden
      const peso = (e: Inscripcion) =>
        e.estado === 'inscrito' ? 0 : e.estado === 'asistio' ? 1 : e.estado === 'acreditado' ? 2 : 3;

      this.inscripciones = data.sort((a, b) => {
        const pa = peso(a);
        const pb = peso(b);
        if (pa !== pb) return pa - pb;
        return (a.eventoFecha || '').localeCompare(b.eventoFecha || '');
      });
    } catch (err) {
      console.error('Error cargando inscripciones:', err);
    } finally {
      this.cargando = false;
    }
  }

  async cancelar(i: Inscripcion) {
    if (!i.id) return;
    if (!confirm('¿Cancelar tu inscripción?')) return;

    try {
      await this.inscripcionesService.cancelarInscripcion(i.id);
      i.estado = 'cancelado';
    } catch (err) {
      console.error(err);
      alert('No se pudo cancelar.');
    }
  }

  estadoBonito(e: Inscripcion['estado']) {
    switch (e) {
      case 'inscrito': return 'Inscrito';
      case 'asistio': return 'Asistió';
      case 'acreditado': return 'Acreditado';
      case 'cancelado': return 'Cancelado';
      
      default: return e;
    }
  }
}
