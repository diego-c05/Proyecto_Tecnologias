import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio-sesion.html',
  styleUrls: ['./inicio-sesion.css']
})
export class InicioSesionComponent {
  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ingresar() {
  if (!this.correo.trim() || !this.contrasena.trim()) {
    this.mensaje = 'Por favor completa todos los campos';
    return;
  }

  this.cargando = true;
  this.mensaje = '';

  try {
    if (this.authService.getCurrentUser()) {
      await this.authService.cerrarSesion();
    }

    const resultado = await this.authService.iniciarSesion(
      this.correo.trim(),
      this.contrasena
    );

    if (!resultado.success || !resultado.user) {
      
      this.mensaje = 'Correo o contraseña incorrectos';
      return;
    }

    const datosUsuario = await this.authService.obtenerDatosUsuario(
      resultado.user.uid
    );

    if (!datosUsuario) {
      this.mensaje = 'No se encontraron datos del usuario';
      return;
    }

    if (datosUsuario.rol === 'coordinador') {
      await this.router.navigate(['/admin/reporte-eventos']);
    } else {
      await this.router.navigate(['/eventos/vereventos']);
    }

  } catch (error) {
    console.error('Error inesperado:', error);
    this.mensaje = 'Error inesperado al iniciar sesión';
  } finally {
    this.cargando = false;
  }
}
}