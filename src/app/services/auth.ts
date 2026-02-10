import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

export interface Usuario {
  uid: string;
  nombreCompleto: string;
  correoElectronico: string;
  nombreUsuario: string;
  rol: 'usuario' | 'coordinador';
  fechaRegistro: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async registrar(
    nombreCompleto: string,
    correoElectronico: string,
    nombreUsuario: string,
    contrasena: string,
    rol: 'usuario' | 'coordinador' = 'usuario'
  ): Promise<{success: boolean, error?: string, user?: User}> {

    try {
      console.log('Creando usuario en Authentication...');
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        correoElectronico,
        contrasena
      );
      console.log('Usuario creado en Authentication:', credencial.user.uid);

      const usuario: Usuario = {
        uid: credencial.user.uid,
        nombreCompleto,
        correoElectronico,
        nombreUsuario,
        rol,
        fechaRegistro: new Date()
      };

      console.log('Guardando datos en Firestore...', usuario);
      
      const docRef = doc(this.firestore, 'usuarios', credencial.user.uid);
      console.log('Referencia del documento:', docRef.path);
      
      const savePromise = setDoc(docRef, usuario);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout guardando en Firestore')), 10000)
      );

      await Promise.race([savePromise, timeoutPromise]);
      console.log('Datos guardados en Firestore exitosamente');

      return { success: true, user: credencial.user };

    } catch (error: any) {
      console.error('ERROR COMPLETO:', error);
      console.error('ERROR CODE:', error.code);
      console.error('ERROR MESSAGE:', error.message);
      console.error('ERROR STACK:', error.stack);
      
      let mensajeError = 'Error al registrar usuario: ' + error.message;
      if (error.code === 'auth/email-already-in-use') mensajeError = 'Este correo ya está registrado';
      if (error.code === 'auth/invalid-email') mensajeError = 'Correo electrónico inválido';
      if (error.code === 'auth/weak-password') mensajeError = 'La contraseña debe tener al menos 6 caracteres';

      return { success: false, error: mensajeError };
    }
  }

  async iniciarSesion(correo: string, contrasena: string): Promise<{success: boolean, error?: string, user?: User}> {
    try {
      const credencial = await signInWithEmailAndPassword(this.auth, correo, contrasena);
      return { success: true, user: credencial.user };
    } catch {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }
  }

  async cerrarSesion(): Promise<{success: boolean, error?: string}> {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch {
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  async obtenerDatosUsuario(uid: string): Promise<Usuario | null> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data() as Usuario;
      return null;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}