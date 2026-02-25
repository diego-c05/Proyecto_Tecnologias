import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navegacion',
    standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion implements OnInit{
        
  rol: 'usuario' | 'coordinador' | null = null;
  usuarioDatos: Usuario | null = null;

  private rolSub?: Subscription;
  private userSub?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}


  async ngOnInit() {
    this.rolSub = this.authService.rol$.subscribe(rol => {
      this.rol = rol;
    });

    this.userSub = this.authService.usuario$.subscribe(async user => {
      if(user){
        this.usuarioDatos = await this.authService.obtenerDatosUsuario(user.uid);
      }else{
        this.usuarioDatos = null;
      }
    });  
  }

  ngOnDestroy() {
    this.rolSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  async logout() {
  const res = await this.authService.cerrarSesion();

  if (res.success) {
    
    localStorage.removeItem('eventoSeleccionado');

    this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
  } else {
    alert(res.error || 'No se pudo cerrar sesión');
  }
}

}
