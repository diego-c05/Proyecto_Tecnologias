import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink , NavigationEnd} from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navegacion',
    standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatIconModule, MatSnackBarModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})

export class Navegacion implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('navToggle') navToggle!: ElementRef<HTMLInputElement>;

  rol: 'usuario' | 'coordinador' | null = null;
  usuarioDatos: Usuario | null = null;

  private rolSub?: Subscription;
  private userSub?: Subscription;
  private navSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.rolSub = this.authService.rol$.subscribe(rol => {
      this.rol = rol;
    });

    this.userSub = this.authService.usuario$.subscribe(async user => {
      if (user) {
        this.usuarioDatos = await this.authService.obtenerDatosUsuario(user.uid);
      } else {
        this.usuarioDatos = null;
      }
    });
  }

  ngAfterViewInit(): void {
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // Cierra el panel lateral si está abierto
        if (this.navToggle?.nativeElement) {
          this.navToggle.nativeElement.checked = false;
        }
      });
  }

  ngOnDestroy() {
    this.rolSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.navSub?.unsubscribe();
  }

  async logout() {
    const res = await this.authService.cerrarSesion();

    if (res.success) {
      localStorage.removeItem('eventoSeleccionado');
      this.router.navigate(['/inicio-sesion'], { replaceUrl: true });
    } else {
      this.showMsg(res.error || 'No se pudo cerrar sesión');
    }
  }

  private showMsg(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}