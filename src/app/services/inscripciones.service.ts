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
  orderBy,
  limit,
} from '@angular/fire/firestore';

export type EstadoInscripcion = 'inscrito' | 'cancelado' | 'asistio' | 'acreditado';

export interface Inscripcion {
  id?: string;

  // relaciones
  eventoId: string;
  usuarioId: string;

  // snapshot 
  eventoNombre?: string;
  eventoHoras?: number;
  eventoFecha?: string;
  materiaNombre?: string;
  materiaCodigo?: string;
  materiaSeccion?: string;
  usuarioCorreo?: string;

  // control
  estado: EstadoInscripcion;
  fechaInscripcion?: any;
}

@Injectable({ providedIn: 'root' })
export class InscripcionesService {
  private firestore = inject(Firestore);
  private colRef = collection(this.firestore, 'inscripciones');

  // CREATE
  async crearInscripcion(data: Omit<Inscripcion, 'id' | 'fechaInscripcion'>): Promise<string> {
    // Evita duplicados
    const existe = await this.existeInscripcion(data.eventoId, data.usuarioId);
    if (existe) throw new Error('Ya estás inscrito en este evento.');

    const ref = await addDoc(this.colRef, {
      ...data,
      fechaInscripcion: serverTimestamp(),
    });

    return ref.id;
  }

  // READ 
  async listarInscripciones(): Promise<Inscripcion[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  // READ (por id)
  async getInscripcionById(id: string): Promise<Inscripcion | null> {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Inscripcion, 'id'>) };
  }

  // READ (por usuario)
  async listarPorUsuario(usuarioId: string): Promise<Inscripcion[]> {
    const q = query(this.colRef, where('usuarioId', '==', usuarioId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  // READ (por evento)
  async listarPorEvento(eventoId: string): Promise<Inscripcion[]> {
    const q = query(this.colRef, where('eventoId', '==', eventoId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Inscripcion, 'id'>) }));
  }

  // READ (inscrito exacto)
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

  // UPDATE
  async actualizarInscripcion(id: string, cambios: Partial<Omit<Inscripcion, 'id' | 'eventoId' | 'usuarioId'>>) {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    await updateDoc(ref, cambios as any);
  }

  // DELETE (o “cancelar”)
  async eliminarInscripcion(id: string) {
    const ref = doc(this.firestore, `inscripciones/${id}`);
    await deleteDoc(ref);
  }

  //  cancelar sin borrar
  async cancelarInscripcion(id: string) {
    await this.actualizarInscripcion(id, { estado: 'cancelado' });
  }
}
