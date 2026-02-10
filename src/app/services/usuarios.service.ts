import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

export type RolUsuario = 'coordinador' | 'usuario';

export interface Usuario {
  uid: string;
  nombreCompleto: string;
  nombreUsuario: string;
  correoElectronico: string;
  rol: RolUsuario;
  fechaRegistro?: any;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private firestore = inject(Firestore);
  private colRef = collection(this.firestore, 'usuarios');

  async crearUsuario(data: Omit<Usuario, 'uid' | 'fechaRegistro'>): Promise<string> {
    const docRef = await addDoc(this.colRef, {
      ...data,
      fechaRegistro: serverTimestamp(),
    });

    await updateDoc(doc(this.firestore, 'usuarios', docRef.id), {
      uid: docRef.id,
    });

    return docRef.id;
  }

  async listarUsuarios(): Promise<(Usuario & { docId: string })[]> {
    const snap = await getDocs(this.colRef);
    return snap.docs.map((d) => ({
      docId: d.id,
      ...(d.data() as Usuario),
    }));
  }

  async actualizarUsuario(
    docId: string,
    cambios: Partial<Omit<Usuario, 'uid' | 'fechaRegistro'>>
  ) {
    const ref = doc(this.firestore, 'usuarios', docId);
    await updateDoc(ref, cambios as any);
  }

  async eliminarUsuario(docId: string) {
    const ref = doc(this.firestore, 'usuarios', docId);
    await deleteDoc(ref);
  }
}
