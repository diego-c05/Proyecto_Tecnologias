import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reporte-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reporte-eventos.html',
  styleUrl: './reporte-eventos.css',
})
export class ReporteEventos {
  eventos = [
    { nombre: 'Limpieza de playa', fecha: '10/02/2026', lugar: 'Tela', cupos: 30, horas: 5 },
    { nombre: 'Reforestación', fecha: '15/02/2026', lugar: 'Zamorano', cupos: 50, horas: 4 },
    { nombre: 'Donación de sangre', fecha: '20/02/2026', lugar: 'Campus', cupos: 40, horas: 3 },
  ];
}
