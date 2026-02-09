import { Injectable, Inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Usuario {
  uid: string;
  nombreCompleto: string;
  correoElectronico: string;
  nombreUsuario: string;
  rol: 'usuario' | 'coordinador';
  fechaRegistro: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    @Inject(Auth) private auth: Auth,
    @Inject(Firestore) private firestore: Firestore
  ) {}

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
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        correoElectronico,
        contrasena
      );

      const usuario: Usuario = {
        uid: credencial.user.uid,
        nombreCompleto,
        correoElectronico,
        nombreUsuario,
        rol,
        fechaRegistro: new Date()
      };

      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), usuario);

      return { success: true, user: credencial.user };
    } catch (error: any) {
      console.error('Error en registro:', error);
      let mensajeError = 'Error al registrar usuario';
      
      if (error.code === 'auth/email-already-in-use') {
        mensajeError = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        mensajeError = 'Correo electrónico inválido';
      } else if (error.code === 'auth/weak-password') {
        mensajeError = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      return { success: false, error: mensajeError };
    }
  }

  async iniciarSesion(correo: string, contrasena: string): Promise<{success: boolean, error?: string, user?: User}> {
    try {
      const credencial = await signInWithEmailAndPassword(
        this.auth,
        correo,
        contrasena
      );
      return { success: true, user: credencial.user };
    } catch (error: any) {
      console.error('Error en inicio de sesión:', error);
      let mensajeError = 'Error al iniciar sesión';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensajeError = 'Correo o contraseña incorrectos';
      } else if (error.code === 'auth/invalid-email') {
        mensajeError = 'Correo electrónico inválido';
      }
      
      return { success: false, error: mensajeError };
    }
  }

  async cerrarSesion(): Promise<{success: boolean, error?: string}> {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  async obtenerDatosUsuario(uid: string): Promise<Usuario | null> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as Usuario;
      }
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