import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InscripcionesService, Inscripcion } from '../../services/inscripciones.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-historial-horas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historial-horas.html',
  styleUrl: './historial-horas.css',
})
export class HistorialHoras implements OnInit {
  historial: Inscripcion[] = [];
  totalHoras = 0;
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
      const todas = await this.inscripcionesService.listarPorUsuario(user.uid);

      // Solo las acreditadas cuentan como horas ganadas
      this.historial = todas.filter(i => i.estado === 'acreditado');

      this.totalHoras = this.historial.reduce(
        (sum, i) => sum + (i.eventoHoras || 0), 0
      );
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      this.cargando = false;
    }
  }
}