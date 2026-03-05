import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from '@angular/fire/firestore';

export interface Notificacion {
  id?: string;
  usuarioId: string;
  mensaje: string;
  leida: boolean;
  fecha?: any;
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private firestore = inject(Firestore);
  private colRef = collection(this.firestore, 'notificaciones');

  async crearNotificacion(usuarioId: string, mensaje: string): Promise<void> {
    await addDoc(this.colRef, {
      usuarioId,
      mensaje,
      leida: false,
      fecha: serverTimestamp(),
    });
  }

  async obtenerNoLeidas(usuarioId: string): Promise<Notificacion[]> {
    const q = query(
      this.colRef,
      where('usuarioId', '==', usuarioId),
      where('leida', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Notificacion, 'id'>),
    }));
  }

  async marcarTodasLeidas(usuarioId: string): Promise<void> {
    const noLeidas = await this.obtenerNoLeidas(usuarioId);
    const promesas = noLeidas.map(n =>
      updateDoc(doc(this.firestore, 'notificaciones', n.id!), { leida: true })
    );
    await Promise.all(promesas);
  }
}