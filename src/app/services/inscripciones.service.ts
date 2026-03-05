import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  limit,
} from '@angular/fire/firestore';
import { NotificacionesService } from './notificaciones.service';

export type EstadoInscripcion = 'inscrito' | 'cancelado' | 'asistio' | 'acreditado';

export interface Inscripcion {
  id?: string;
  eventoId: string;
  usuarioId: string;
  eventoNombre?: string;
  eventoHoras?: number;
  eventoFecha?: string;
  materiaNombre?: string;
  materiaCodigo?: string;
  materiaSeccion?: string;
  usuarioCorreo?: string;
  estado: EstadoInscripcion;
  fechaInscripcion?: any;
}

@Injectable({ providedIn: 'root' })
export class InscripcionesService {
  private firestore = inject(Firestore);
  private notificacionesService = inject(NotificacionesService);
  private colRef = collection(this.firestore, 'inscripciones');

  async crearInscripcion(data: Omit<Inscripcion, 'id' | 'fechaInscripcion'>): Promise<string> {
    const existe = await this.existeInscripcion(data.eventoId, data.usuarioId);
    if (existe) throw new Error('Ya estás inscrito en este evento.');

    const ref = await addDoc(this.colRef, {
      ...data,
      fechaInscripcion: serverTimestamp(),
    });

    return ref.id;
  }

  async listarInscripciones(): Promise<Inscripcion[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  async getInscripcionById(id: string): Promise<Inscripcion | null> {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Inscripcion, 'id'>) };
  }

  async listarPorUsuario(usuarioId: string): Promise<Inscripcion[]> {
    const q = query(this.colRef, where('usuarioId', '==', usuarioId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  async listarPorEvento(eventoId: string): Promise<Inscripcion[]> {
    const q = query(this.colRef, where('eventoId', '==', eventoId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  async existeInscripcion(eventoId: string, usuarioId: string): Promise<boolean> {
    const q = query(
      this.colRef,
      where('eventoId', '==', eventoId),
      where('usuarioId', '==', usuarioId),
      limit(1)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }

  async actualizarInscripcion(id: string, cambios: Partial<Omit<Inscripcion, 'id' | 'eventoId' | 'usuarioId'>>) {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    await updateDoc(ref, cambios as any);
  }

  async acreditarInscripcion(id: string, eventoNombre: string, usuarioId: string): Promise<void> {
    await this.actualizarInscripcion(id, { estado: 'acreditado' });
    await this.notificacionesService.crearNotificacion(
      usuarioId,
      `Se te han acreditado las horas del evento: ${eventoNombre}`
    );
  }

  async eliminarInscripcion(id: string) {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    await deleteDoc(ref);
  }

  async cancelarInscripcion(id: string) {
    await this.actualizarInscripcion(id, { estado: 'cancelado' });
  }
}