import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 


@Component({
  selector: 'app-vereventos',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './vereventos.html',
  styleUrl: './vereventos.css',
})

export class Vereventos {
 eventos = [
    {
      id: 1,
      nombre: 'Voluntariado Corporativo: Arteterapia con Café',
      fecha: '2026-03-25',
      hora: '14:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Centro Comunitario La Esperanza, Col. Kennedy',
      descripcion: 'Actividad de voluntariado donde compartiremos arte y café con la comunidad.',
      descripcionCompleta: 'Un evento de voluntariado para estudiantes que desean realizar horas de vinculación. Participarás en actividades de arteterapia combinadas con café, ayudando a la comunidad local.',
      horasVoluntariado: 4,
      cuposDisponibles: 25,
      imagen: 'https://www.aboutespanol.com/thmb/71nZ9hc5LFxAQAcWjUTJdwpVelE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cafeypresionarterial-5661b2403df78cedb0b700ae.jpg',
      categoria: 'Caridad y Causas Sociales',
      estado: 'disponible'
    },
    {
      id: 2,
      nombre: 'Limpieza de Refugio de Animales ARI',
      fecha: '2026-03-28',
      hora: '08:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Refugio ARI, Carretera a El Hatillo Km 7',
      descripcion: 'Ayuda en la limpieza y cuidado del refugio de animales.',
      descripcionCompleta: 'Voluntariado enfocado en el bienestar animal. Actividades incluyen limpieza de instalaciones, alimentación de animales, y mantenimiento general del refugio.',
      horasVoluntariado: 5,
      cuposDisponibles: 30,
      imagen: 'https://www.laprensa.hn/binrepository/972x648/0c0/0d0/none/11004/VSFK/perros5_2078991_20220727131616.jpg',
      categoria: 'Bienestar Animal',
      estado: 'disponible'
    },
    {
      id: 3,
      nombre: 'Fundación Abrigo: Elaboración de Cenas',
      fecha: '2026-04-05',
      hora: '16:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Fundación Abrigo, Barrio La Granja',
      descripcion: 'Preparación de cenas para personas en situación vulnerable.',
      descripcionCompleta: 'Actividad de preparación de alimentos para personas sin hogar. Los voluntarios ayudarán en la cocina, preparación de ingredientes, y distribución de comidas.',
      horasVoluntariado: 4,
      cuposDisponibles: 20,
      imagen: 'https://www.ahm-honduras.com/zipodemos/wp-content/uploads/2018/05/TRC3.jpg',
      categoria: 'Caridad y Causas Sociales',
      estado: 'disponible'
    },
    {
      id: 4,
      nombre: 'Limpieza de Áreas Verdes - Parque La Leona',
      fecha: '2026-04-14',
      hora: '08:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Parque La Leona, Col. Lomas del Guijarro',
      descripcion: 'Jornada de limpieza y reforestación en parque municipal.',
      descripcionCompleta: 'Voluntariado ambiental enfocado en la limpieza y embellecimiento de espacios públicos. Incluye recolección de basura, plantación de árboles, y mantenimiento de jardines.',
      horasVoluntariado: 6,
      cuposDisponibles: 50,
      imagen: 'https://departamento19.hn/wp-content/uploads/2022/05/parque-La-Leona.jpg',
      categoria: 'Medio Ambiente',
      estado: 'disponible'
    },
    {
      id: 5,
      nombre: 'Taller de Mandalas en Asilo de Ancianos',
      fecha: '2026-02-13',
      hora: '09:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Asilo Hilos de Plata, Barrio La Bolsa',
      descripcion: 'Tarde de arte y compañía con adultos mayores.',
      descripcionCompleta: 'Actividad recreativa con adultos mayores. Los voluntarios guiarán talleres de pintura de mandalas, compartirán conversaciones, y brindarán compañía a los residentes del asilo.',
      horasVoluntariado: 3,
      cuposDisponibles: 15,
      imagen: 'https://clpvd.org/wp-content/uploads/2025/09/mandala-2-600x400.png',
      categoria: 'Adulto Mayor',
      estado: 'finalizado'
    },
    {
      id: 6,
      nombre: 'Recolección de Kilos de Amor',
      fecha: '2026-04-07',
      hora: '13:00',
      ubicacion: 'Tegucigalpa, Francisco Morazán',
      direccion: 'Banco de Alimentos, Barrio Abajo',
      descripcion: 'Recolección y organización de donaciones de alimentos.',
      descripcionCompleta: 'Voluntariado en banco de alimentos. Actividades incluyen recepción de donaciones, clasificación de productos, empaquetado, y preparación de kits de alimentos.',
      horasVoluntariado: 4,
      cuposDisponibles: 35,
      imagen: 'https://www.bbva.com/wp-content/uploads/2024/04/BBVA-donacion-alimentos-sostenibilidad.jpg',
      categoria: 'Caridad y Causas Sociales',
      estado: 'disponible'
    }
  ];

    formatearFecha(fecha: string): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    return `${dia} ${mes}`;
  }

  guardarEvento(evento: any) {
  localStorage.setItem('eventoSeleccionado', JSON.stringify(evento));
}
}
