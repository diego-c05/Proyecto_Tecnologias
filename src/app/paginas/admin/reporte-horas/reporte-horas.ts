import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UsuariosService, Usuario } from '../../../services/usuarios.service';
import { InscripcionesService, Inscripcion } from '../../../services/inscripciones.service';

interface EstudianteHoras {
  uid: string;
  nombreUsuario: string;
  correoElectronico: string;
  totalHoras: number;
  horasFaltantes: number;
}

interface HistorialItem {
  eventoNombre: string;
  materiaNombre: string;
  eventoFecha: string;
  eventoHoras: number;
  estado: string;
}

@Component({
  selector: 'app-reporte-horas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reporte-horas.html',
  styleUrl: './reporte-horas.css',
})
export class ReporteHoras implements OnInit {
  private usuariosService = inject(UsuariosService);
  private inscripcionesService = inject(InscripcionesService);

  readonly META_HORAS = 70;

  private historialBase: EstudianteHoras[] = [];

  historial: EstudianteHoras[] = [];
  pendientes: EstudianteHoras[] = [];
  completas: EstudianteHoras[] = [];

  totalEstudiantesRegistrados = 0;
  totalEstudiantesPendientes = 0;
  totalEstudiantesCompletas = 0;

  cargando = false;
  errorMsg = '';

  private inscripcionesCache: Inscripcion[] = [];

  modalAbierto = false;
  modalEstudianteNombre = '';
  modalEstudianteUid = '';
  historialEventos: HistorialItem[] = [];
  totalHorasHistorial = 0;
  filtroNombre = '';
  filtroHorasTotales = '';   
  filtroHorasRestantes = ''; 

  async ngOnInit(): Promise<void> {
    await this.cargarReporte();
  }

  private estadoNorm(e?: string) {
    return (e || '').toString().trim().toLowerCase();
  }

  private horasDeInscripcion(ins: Inscripcion): number {
    const n = Number(ins.eventoHoras ?? 0);
    return isNaN(n) ? 0 : n;
  }

  async cargarReporte(): Promise<void> {
    try {
      this.cargando = true;
      this.errorMsg = '';

      const usuarios: Usuario[] = await this.usuariosService.listarUsuarios();

      const estudiantesBase = usuarios
        .filter(u => (u.rol || '').toString().trim().toLowerCase() === 'usuario')
        .map(u => ({
          uid: (u.uid || (u as any).docId || '').toString(),
          nombreUsuario: (u.nombreUsuario || '').toString().trim() || 'Sin nombre',
          correoElectronico: (u.correoElectronico || '').toString().trim() || '',
        }))
        .filter(u => u.uid !== '');

      const inscripciones: Inscripcion[] = await this.inscripcionesService.listarInscripciones();
      this.inscripcionesCache = inscripciones;

      const horasPorUsuario = new Map<string, number>();

      for (const ins of inscripciones) {
        const usuarioId = (ins.usuarioId || '').toString();
        if (!usuarioId) continue;

        const estado = this.estadoNorm(ins.estado);
        if (estado === 'cancelado') continue;

        const horas = this.horasDeInscripcion(ins);
        const prev = horasPorUsuario.get(usuarioId) ?? 0;
        horasPorUsuario.set(usuarioId, prev + horas);
      }

      const lista: EstudianteHoras[] = estudiantesBase.map(u => {
        const total = Math.max(0, Math.round((horasPorUsuario.get(u.uid) ?? 0) * 100) / 100);
        return {
          uid: u.uid,
          nombreUsuario: u.nombreUsuario,
          correoElectronico: u.correoElectronico,
          totalHoras: total,
          horasFaltantes: Math.max(0, this.META_HORAS - total),
        };
      });

      lista.sort((a, b) => b.totalHoras - a.totalHoras);

      this.historialBase = lista;

      this.totalEstudiantesRegistrados = this.historialBase.length;
      this.totalEstudiantesPendientes = this.historialBase.filter(s => s.totalHoras < this.META_HORAS).length;
      this.totalEstudiantesCompletas = this.historialBase.filter(s => s.totalHoras >= this.META_HORAS).length;

      this.aplicarFiltros();
    } catch (err: any) {
      this.errorMsg = err?.message || 'Ocurrió un error cargando el reporte.';
      this.historialBase = [];
      this.historial = [];
      this.pendientes = [];
      this.completas = [];

      this.totalEstudiantesRegistrados = 0;
      this.totalEstudiantesPendientes = 0;
      this.totalEstudiantesCompletas = 0;

      this.inscripcionesCache = [];
    } finally {
      this.cargando = false;
    }
  }

  aplicarFiltros(): void {
    const nombre = (this.filtroNombre || '').trim().toLowerCase();

    const totalesTxt = (this.filtroHorasTotales ?? '').toString().trim();
    const restantesTxt = (this.filtroHorasRestantes ?? '').toString().trim();

    const usarTotales = totalesTxt !== '' && !isNaN(Number(totalesTxt));
    const usarRestantes = restantesTxt !== '' && !isNaN(Number(restantesTxt));

    const totalesVal = Number(totalesTxt);
    const restantesVal = Number(restantesTxt);

    const filtrado = this.historialBase.filter(s => {
      const okNombre =
        nombre === '' || (s.nombreUsuario || '').toLowerCase().includes(nombre);

      const okTotales = !usarTotales || s.totalHoras === totalesVal;
      const okRestantes = !usarRestantes || s.horasFaltantes === restantesVal;

      return okNombre && okTotales && okRestantes;
    });

    this.historial = filtrado;
    this.pendientes = filtrado.filter(s => s.totalHoras < this.META_HORAS);
    this.completas = filtrado.filter(s => s.totalHoras >= this.META_HORAS);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroHorasTotales = '';
    this.filtroHorasRestantes = '';
    this.aplicarFiltros();
  }

  abrirHistorial(est: EstudianteHoras): void {
    this.modalEstudianteNombre = est.nombreUsuario;
    this.modalEstudianteUid = est.uid;

    const registros = this.inscripcionesCache.filter(i => (i.usuarioId || '').toString() === est.uid);

    const lista: HistorialItem[] = registros.map(i => ({
      eventoNombre: (i.eventoNombre || 'Sin evento').toString(),
      materiaNombre: (i.materiaNombre || 'Sin materia').toString(),
      eventoFecha: (i.eventoFecha || '').toString(),
      eventoHoras: this.horasDeInscripcion(i),
      estado: (i.estado || 'Sin estado').toString(),
    }));

    lista.sort((a, b) => (a.eventoFecha || '').localeCompare(b.eventoFecha || ''));

    const total = lista.reduce((acc, it) => {
      const e = this.estadoNorm(it.estado);
      if (e === 'cancelado') return acc;
      return acc + (Number(it.eventoHoras) || 0);
    }, 0);

    this.historialEventos = lista;
    this.totalHorasHistorial = Math.max(0, Math.round(total * 100) / 100);

    this.modalAbierto = true;
  }

  cerrarHistorial(): void {
    this.modalAbierto = false;
    this.modalEstudianteNombre = '';
    this.modalEstudianteUid = '';
    this.historialEventos = [];
    this.totalHorasHistorial = 0;
  }

  trackByUid(_: number, item: EstudianteHoras) {
    return item.uid;
  }

  trackByHistorial(_: number, item: HistorialItem) {
    return `${item.eventoNombre}-${item.materiaNombre}-${item.eventoFecha}-${item.eventoHoras}-${item.estado}`;
  }
}