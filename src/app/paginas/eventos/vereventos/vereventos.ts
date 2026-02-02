import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-vereventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vereventos.html',
  styleUrl: './vereventos.css',
})

export class Vereventos {
eventos = [
    {
      id: 1,
      nombre: 'Conferencia de Tecnología',
      fecha: '2026-02-15',
      hora: '14:00',
      lugar: 'Auditorio Principal',
      descripcion: 'Charla sobre nuevas tendencias en desarrollo web',
      horasAcreditadas: 3,
      cuposDisponibles: 50
    },
    // Más eventos de ejemplo...
  ];
}
