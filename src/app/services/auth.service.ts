import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { authState } from '@angular/fire/auth';

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

  private usuarioSubject = new BehaviorSubject<User | null | undefined>(undefined);
  usuario$ = this.usuarioSubject.asObservable();

  private rolSubject = new BehaviorSubject<'usuario' | 'coordinador' | null>(null);
  rol$ = this.rolSubject.asObservable();

  constructor() {
    authState(this.auth).subscribe(async (user) => {
      this.usuarioSubject.next(user);

      if (user) {
        const ref = doc(this.firestore, 'usuarios', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          this.rolSubject.next(snap.data()['rol']);
        } else {
          this.rolSubject.next(null);
        }
      } else {
        this.rolSubject.next(null);
      }
    });
  }

  isLoading(): boolean { return this.usuarioSubject.value === undefined; }

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
      console.error('Error registro:', error);

      let mensajeError = 'Error al registrar usuario';
      if (error.code === 'auth/email-already-in-use') mensajeError = 'Este correo ya está registrado';
      if (error.code === 'auth/invalid-email') mensajeError = 'Correo electrónico inválido';
      if (error.code === 'auth/weak-password') mensajeError = 'La contraseña debe tener al menos 6 caracteres';

      return { success: false, error: mensajeError };
    }
  }

  async iniciarSesion(
  correo: string,
  contrasena: string
): Promise<{success: boolean, error?: string, user?: User}> {

  if (!correo?.trim() || !contrasena?.trim()) {
    return {
      success: false,
      error: 'Correo y contraseña son obligatorios'
    };
  }

  try {
    if (this.auth.currentUser) {
      await signOut(this.auth);
    }

    const credencial = await signInWithEmailAndPassword(
      this.auth,
      correo.trim(),
      contrasena
    );

    return { success: true, user: credencial.user };

  } catch (error: any) {
    console.error('Error login:', error);

    let mensaje = 'Correo o contraseña incorrectos';

    if (error.code === 'auth/user-not-found') mensaje = 'Usuario no encontrado';
    if (error.code === 'auth/wrong-password') mensaje = 'Contraseña incorrecta';
    if (error.code === 'auth/invalid-email') mensaje = 'Correo inválido';

    return { success: false, error: mensaje };
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