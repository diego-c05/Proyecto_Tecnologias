import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { EventsService, Evento } from '../../../services/events.service';
import { Materias } from '../../../services/materia/materias';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../../Confirm/confirm-dialog.ts/confirm-dialog.ts';

type EventoTabla = {
  id: string;
  nombre: string;
  fecha: string;
  rawDate: string;
  lugar: string;
  cupos: number;
  horas: number;
  materia: string;
  modalidad: string;
  seccion: string | number;

  description?: string;
  imageUrl?: string;

  materiaId?: string;
  materiaCodigo?: string;
};

type MateriaItem = {
  id: string;
  codigo: string;
  nombre: string;
  seccion: string | number;
};

@Component({
  selector: 'app-reporte-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './reporte-eventos.html',
  styleUrl: './reporte-eventos.css',
})
export class ReporteEventos {
  private destroyRef = inject(DestroyRef);
  private eventsService = inject(EventsService);
  private materiasService = inject(Materias);
  private snackBar = inject(MatSnackBar);
private dialog = inject(MatDialog);

  eventosAll: EventoTabla[] = [];
  eventos: EventoTabla[] = [];

  eventosPublicados = 0;
  cuposTotales = 0;
  horasDisponibles = 0;

  searchText = '';
  modalityFilter: string = 'Todos';
  materiaFilter: string = 'Todos';
  dateFrom: string = '';
  dateTo: string = '';
  hoursFilter: number | null = null;

  private _noHoursMatch = false;

  materias: MateriaItem[] = [];

  editing = false;
  saving = false;

  form: {
    id: string;
    name: string;
    date: string;
    hours: number | null;
    slots: number | null;
    modality: string;
    location: string;
    description: string;
    imageUrl: string;

    materiaId: string;
    materiaNombre: string;
    materiaCodigo: string;
    materiaSeccion: string | number;
  } = this.emptyForm();

  get emptyMessage(): string {
    if (this._noHoursMatch && this.hoursFilter !== null) {
      return `No hay eventos disponibles con esa cantidad de horas (${this.hoursFilter}).`;
    }
    return 'No hay eventos para mostrar.';
  }

  constructor() {
    this.loadMaterias();

    // Si tu service emite cuando cambia algo en materias (lo traías antes)
    if ((this.materiasService as any).refrescar$) {
      (this.materiasService as any).refrescar$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.loadMaterias());
    }

    this.eventsService
      .getEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const lista = (data || []).map((e) => this.mapToTable(e));

        this.eventosAll = lista;

        this.eventosPublicados = lista.length;
        this.cuposTotales = lista.reduce((acc, x) => acc + (Number(x.cupos) || 0), 0);
        this.horasDisponibles = lista.reduce((acc, x) => acc + (Number(x.horas) || 0), 0);

        this.applyFilters();
      });
  }

  async loadMaterias(): Promise<void> {
    try {
      const raw = await this.materiasService.listarMaterias();
      this.materias = (raw || []).map((m: any) => ({
        id: String(m.id ?? ''),
        codigo: String(m.codigo ?? ''),
        nombre: String(m.nombre ?? ''),
        seccion: m.seccion ?? '',
      }));
    } catch {
      this.materias = [];
    }
  }

  applyFilters(): void {
    const q = (this.searchText || '').trim().toLowerCase();
    let result = [...this.eventosAll];

    // Buscar por texto
    if (q) {
      result = result.filter((e) =>
        e.nombre.toLowerCase().includes(q) ||
        e.lugar.toLowerCase().includes(q) ||
        e.materia.toLowerCase().includes(q) ||
        e.modalidad.toLowerCase().includes(q) ||
        String(e.seccion).toLowerCase().includes(q)
      );
    }

    // Modalidad
    if (this.modalityFilter && this.modalityFilter !== 'Todos') {
      const mod = this.modalityFilter.toLowerCase();
      result = result.filter((e) => (e.modalidad || '').toLowerCase() === mod);
    }

    // Materia (por ID exacto)
    if (this.materiaFilter && this.materiaFilter !== 'Todos') {
      const mid = this.materiaFilter;
      result = result.filter((e) => (e.materiaId || '') === mid);
    }

    // Rango de fechas
    const fromKey = this.dateFrom ? this.dateKey(this.dateFrom) : null;
    const toKey = this.dateTo ? this.dateKey(this.dateTo) : null;

    if (fromKey !== null) result = result.filter((e) => this.dateKey(e.rawDate) >= fromKey);
    if (toKey !== null) result = result.filter((e) => this.dateKey(e.rawDate) <= toKey);

    // Horas exactas
    const hasHours = this.hoursFilter !== null && Number.isFinite(this.hoursFilter);
    if (hasHours) {
      const h = Number(this.hoursFilter);
      result = result.filter((e) => Number(e.horas) === h);
    }

    this._noHoursMatch = hasHours && result.length === 0;

    // Orden por fecha (más recientes primero)
    result.sort((a, b) => this.dateKey(b.rawDate) - this.dateKey(a.rawDate));

    this.eventos = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.modalityFilter = 'Todos';
    this.materiaFilter = 'Todos';
    this.dateFrom = '';
    this.dateTo = '';
    this.hoursFilter = null;
    this._noHoursMatch = false;
    this.applyFilters();
  }

  onHoursInput(value: any): void {
    const v = String(value ?? '').trim();
    if (v === '') {
      this.hoursFilter = null;
    } else {
      const n = Number(v);
      this.hoursFilter = Number.isFinite(n) ? n : null;
    }
    this.applyFilters();
  }

  async onDelete(e: EventoTabla): Promise<void> {
    if (!e.id) return;

      const ref = this.dialog.open(ConfirmDialogComponent, {
    data: { message: `¿Seguro que deseas eliminar el evento "${e.nombre}"?` },
  });

  const ok = await firstValueFrom(ref.afterClosed());
  if (!ok) return;
    try {
      await this.eventsService.deleteEvent(e.id);
       this.showMsg('Evento eliminado');
      if (this.editing && this.form.id === e.id) this.cancelEdit();
    } catch {
      this.showMsg('No se pudo eliminar el evento. Intenta de nuevo.');
    }
  }

  onEdit(e: EventoTabla): void {
    this.editing = true;
    this.saving = false;

    this.form = {
      id: e.id,
      name: e.nombre ?? '',
      date: e.rawDate ?? '',
      hours: Number.isFinite(e.horas) ? Number(e.horas) : null,
      slots: Number.isFinite(e.cupos) ? Number(e.cupos) : null,
      modality: e.modalidad ?? 'Presencial',
      location: e.lugar ?? '',
      description: e.description ?? '',
      imageUrl: e.imageUrl ?? '',

      materiaId: e.materiaId ?? '',
      materiaNombre: e.materia ?? '',
      materiaCodigo: e.materiaCodigo ?? '',
      materiaSeccion: e.seccion ?? '',
    };

    // Si ya trae materiaId, intenta sincronizar datos readonly por si cambió en BD
    if (this.form.materiaId) this.onMateriaChange(this.form.materiaId);
  }

  cancelEdit(): void {
    this.editing = false;
    this.saving = false;
    this.form = this.emptyForm();
  }

  onMateriaChange(materiaId: string): void {
    const m = this.materias.find((x) => x.id === materiaId);

    if (!m) {
      this.form.materiaId = '';
      this.form.materiaNombre = '';
      this.form.materiaCodigo = '';
      this.form.materiaSeccion = '';
      return;
    }

    this.form.materiaId = m.id;
    this.form.materiaNombre = m.nombre;
    this.form.materiaCodigo = m.codigo;
    this.form.materiaSeccion = m.seccion;
  }

  async saveEdit(): Promise<void> {
    if (!this.form.id) return;
if (!this.form.name.trim()) { this.showMsg('El nombre del evento es obligatorio.'); return; }
if (!this.form.date) { this.showMsg('La fecha es obligatoria.'); return; }
if (!this.form.location.trim()) { this.showMsg('El lugar es obligatorio.'); return; }
if (this.form.hours === null || this.form.hours < 0) { this.showMsg('Horas inválidas.'); return; }
if (this.form.slots === null || this.form.slots < 0) { this.showMsg('Cupos inválidos.'); return; }
if (!this.form.modality) { this.showMsg('La modalidad es obligatoria.'); return; }
if (!this.form.materiaId) { this.showMsg('Selecciona una materia.'); return; }

    this.saving = true;

    const payload: any = {
      name: this.form.name.trim(),
      date: this.form.date,
      hours: Number(this.form.hours),
      slots: Number(this.form.slots),
      modality: this.form.modality,
      location: this.form.location.trim(),
      description: (this.form.description || '').trim(),
      imageUrl: (this.form.imageUrl || '').trim(),
      materiaId: this.form.materiaId,
      materiaNombre: this.form.materiaNombre,
      materiaCodigo: this.form.materiaCodigo,
      materiaSeccion: this.form.materiaSeccion,
    };

    try {
      await this.eventsService.updateEvent(this.form.id, payload as Evento);
      this.showMsg('Evento actualizado');
      this.cancelEdit();
    } catch {
    this.showMsg('No se pudo actualizar el evento. Intenta de nuevo.');
    } finally {
      this.saving = false;
    }
  }

  private emptyForm() {
    return {
      id: '',
      name: '',
      date: '',
      hours: null,
      slots: null,
      modality: 'Presencial',
      location: '',
      description: '',
      imageUrl: '',
      materiaId: '',
      materiaNombre: '',
      materiaCodigo: '',
      materiaSeccion: '',
    };
  }

  private mapToTable(e: Evento): EventoTabla {
    const rawDate = (e as any).date ?? '';

    return {
      id: (e as any).id ?? '',
      nombre: (e as any).name ?? '',
      rawDate,
      fecha: this.formatDate(rawDate),
      lugar: (e as any).location ?? '',
      cupos: Number((e as any).slots) || 0,
      horas: Number((e as any).hours) || 0,
      materia: (e as any).materiaNombre ?? '',
      modalidad: (e as any).modality ?? '',
      seccion: (e as any).materiaSeccion ?? '',
      description: (e as any).description ?? '',
      imageUrl: (e as any).imageUrl ?? '',
      materiaId: (e as any).materiaId ?? '',
      materiaCodigo: (e as any).materiaCodigo ?? '',
    };
  }

  private formatDate(value?: string): string {
    if (!value) return '';
    const onlyDate = value.includes('T') ? value.split('T')[0] : value;
    const parts = onlyDate.split('-');
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts;
      return `${dd}/${mm}/${yyyy}`;
    }
    return value;
  }

  private dateKey(raw: string): number {
    if (!raw) return 0;
    const onlyDate = raw.includes('T') ? raw.split('T')[0] : raw;
    const d = new Date(onlyDate);
    const t = d.getTime();
    return Number.isFinite(t) ? t : 0;
  }

  private showMsg(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  });
}
}