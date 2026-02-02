import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reporte-horas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reporte-horas.html',
  styleUrl: './reporte-horas.css',
})
export class ReporteHoras {
  estudiantes = [
    { cuenta: '32211089', nombre: 'Josue Ramirez', eventos: 4, horas: 18 },
    { cuenta: '32199887', nombre: 'Maria Lopez', eventos: 3, horas: 10 },
    { cuenta: '32155443', nombre: 'Carlos Mejia', eventos: 2, horas: 6 },
  ];
}
