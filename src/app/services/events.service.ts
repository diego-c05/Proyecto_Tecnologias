
import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  getDocs,
  getDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


export interface Evento {
  id?: string;
  name: string;
  date: string;
  hours: number;        
  slots: number;       
  modality: 'Presencial' | 'Virtual';
  location: string;
  description?: string;
  imageUrl?: string; 
  materiaId?: string; 
  coordinadorId?: string;
}


@Injectable({ providedIn: 'root' })
export class EventsService {
  private firestore = inject(Firestore);

  getEvents(): Observable<Evento[]> {
    const eventsRef = collection(this.firestore, 'events');
    return collectionData(eventsRef, { idField: 'id' }) as Observable<Evento[]>;
  }


  async listEvents(): Promise<Evento[]> {
    const eventsRef = collection(this.firestore, 'events');
    const snap = await getDocs(eventsRef);

    return snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Evento, 'id'>)
    }));
  }

  async getEventById(id: string): Promise<Evento | null> {
  const ref = doc(this.firestore, `events/${id}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Omit<Evento, 'id'>)
  };
}

  createEvent(evento: Evento) {
    const eventsRef = collection(this.firestore, 'events');
    return addDoc(eventsRef, evento);
  }

  updateEvent(id: string, evento: Evento) {
    const ref = doc(this.firestore, `events/${id}`);
    return updateDoc(ref, { ...evento });
  }

  deleteEvent(id: string) {
    const ref = doc(this.firestore, `events/${id}`);
    return deleteDoc(ref);
  }

  async listarEventosPorCoordinador(coordinadorId: string): Promise<Evento[]> {
  const q = query(
    collection(this.firestore, 'events'),
    where('coordinadorId', '==', coordinadorId)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Evento, 'id'>),
  }));
}
}
