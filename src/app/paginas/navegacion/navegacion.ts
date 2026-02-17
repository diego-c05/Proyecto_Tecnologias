import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacion',
    standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion implements OnInit{
        rol: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}


  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const datos = await this.authService.obtenerDatosUsuario(user.uid);
      this.rol = datos?.rol ?? null;
    }
  }

  async logout() {
  const res = await this.authService.cerrarSesion();

  if (res.success) {
    
    localStorage.removeItem('eventoSeleccionado');

    this.router.navigate(['/inicio-sesion']);
  } else {
    alert(res.error || 'No se pudo cerrar sesión');
  }
}

}
