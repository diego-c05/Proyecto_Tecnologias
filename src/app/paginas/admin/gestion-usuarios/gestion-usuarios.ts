import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService, Usuario, RolUsuario } from '../../../services/usuarios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../Confirm/confirm-dialog.ts/confirm-dialog.ts';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
 private snackBar = inject(MatSnackBar);
private dialog = inject(MatDialog);

  usuarios: (Usuario & { docId: string })[] = [];
  errorMsg: string | null = null;
  okMsg: string | null = null;

  editandoDocId: string | null = null;

  form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    rol: ['usuario' as RolUsuario, [Validators.required]],
  });

  editForm = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    rol: ['usuario' as RolUsuario, [Validators.required]],
  });

  get totalUsuariosNormales(): number {
    return this.usuarios.filter(u => u.rol === 'usuario').length;
  }

  get totalCoordinadores(): number {
    return this.usuarios.filter(u => u.rol === 'coordinador').length;
  }

  async ngOnInit() {
    await this.cargar();
  }

  private rolValido(rol: any): rol is RolUsuario {
    return rol === 'usuario' || rol === 'coordinador';
  }

  async cargar() {
    this.usuarios = await this.usuariosService.listarUsuarios();
  }

  async crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value as any;

    if (!this.rolValido(val.rol)) return;

    await this.usuariosService.crearUsuario({
      nombreCompleto: val.nombreCompleto,
      nombreUsuario: val.nombreUsuario,
      correoElectronico: val.correoElectronico,
      rol: val.rol,
    });

this.showMsg(`Usuario ${val.nombreCompleto} creado correctamente`);
    this.form.reset({ rol: 'usuario' as RolUsuario });
    await this.cargar();
  }

  async eliminar(docId: string) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: '¿Desea eliminar este usuario?' }
  });

  const confirmado = await dialogRef.afterClosed().toPromise();
  if (!confirmado) return;

    if (this.editandoDocId === docId) {
      this.cancelarEdicion();
    }

    await this.usuariosService.eliminarUsuario(docId);
  this.showMsg('Usuario eliminado correctamente');
    await this.cargar();
  }

  empezarEdicion(u: Usuario & { docId: string }) {
    this.editandoDocId = u.docId;

    this.editForm.patchValue({
      nombreCompleto: u.nombreCompleto,
      nombreUsuario: u.nombreUsuario,
      correoElectronico: u.correoElectronico,
      rol: u.rol,
    });
  }

  cancelarEdicion() {
    this.editandoDocId = null;
  }

  async guardarEdicion() {
    if (!this.editandoDocId || this.editForm.invalid) return;

    const val = this.editForm.value as any;

    if (!this.rolValido(val.rol)) return;

    await this.usuariosService.actualizarUsuario(this.editandoDocId, {
      nombreCompleto: val.nombreCompleto,
      nombreUsuario: val.nombreUsuario,
      correoElectronico: val.correoElectronico,
      rol: val.rol,
    });

    this.showMsg(`Usuario ${val.nombreCompleto} actualizado correctamente`);
    this.editandoDocId = null;
    await this.cargar();
  }

  private showMsg(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 2500,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  });
}
}
