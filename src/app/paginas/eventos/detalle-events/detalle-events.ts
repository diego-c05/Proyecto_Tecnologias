import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-events.html',
  styleUrl: './detalle-events.css',
})

export class DetalleEvents implements OnInit{
  evento: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    
    const eventoGuardado = localStorage.getItem('eventoSeleccionado');
    if (eventoGuardado) {
      this.evento = JSON.parse(eventoGuardado);
    } else {
 
      this.router.navigate(['/eventos/vereventos']);
    }
  }

   volver() {
    this.router.navigate(['/eventos/vereventos']);
  }

  inscribirse() {
    alert('¡Inscripción registrada! Tus horas serán acreditadas automáticamente.');
  }

  formatearFechaCompleta(fecha: string): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    return `${dia} de ${mes}`;
  }

}
