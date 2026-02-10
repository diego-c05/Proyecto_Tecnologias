import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Materias {

  private refrescarMaterias$ = new Subject<void>();

  refrescar$ = this.refrescarMaterias$.asObservable();

  private materia$ = new Subject<any>();

  constructor(private firestore: Firestore) { }

  //Insertar 
  insertarMateria(materia: any) {
    const ref = collection(this.firestore, 'materias');
    return addDoc(ref, materia).then(() => {
      
      this.refrescarMaterias$.next();
    });
  }

  //Listar
  async listarMaterias() {
    const ref = collection(this.firestore, 'materias');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  //Eliminar
  async eliminarMateria(id: string) {
    const ref = doc(this.firestore, 'materias', id);
    await deleteDoc(ref); 
    this.refrescarMaterias$.next();
  }

  //Editar
  editarMateria(materia: any){
    this.materia$.next(materia);
  }

  //Obtener los datos de la materia seleccionada
  getMateria():Observable<any>
  {
    return this.materia$.asObservable();
  }

  //Modificar en la base de datos
  async actualizarMateria(id: string, cambios: any) { 
    const ref = doc(this.firestore, 'materias', id); 
    await updateDoc(ref, cambios); 
    this.refrescarMaterias$.next(); 
  }
}

