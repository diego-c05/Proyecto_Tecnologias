import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {

  nombreCompleto: string = '';
  correoElectronico: string = '';
  nombreUsuario: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  async registrarse() {
    console.log('Iniciando registro...');
    
    if (
      !this.nombreCompleto ||
      !this.correoElectronico ||
      !this.nombreUsuario ||
      !this.contrasena ||
      !this.confirmarContrasena
    ) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    if (this.contrasena.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.cdr.detectChanges(); 

    try {
      const resultado = await this.authService.registrar(
        this.nombreCompleto,
        this.correoElectronico,
        this.nombreUsuario,
        this.contrasena
      );

      console.log('Respuesta recibida:', resultado);

      this.cargando = false;

      if (resultado.success) {
        console.log('Registro exitoso');
        this.mensaje = 'Registro exitoso. Redirigiendo...';
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.router.navigate(['/inicio-sesion']);
        }, 1500);
      } else {
        console.log('Registro falló:', resultado.error);
        this.mensaje = '' + (resultado.error || 'Error inesperado');
        this.cdr.detectChanges();
      }

    } catch (error) {
      console.error('Error inesperado:', error);
      this.cargando = false;
      this.mensaje = 'Error inesperado';
      this.cdr.detectChanges();
    }
  }
}