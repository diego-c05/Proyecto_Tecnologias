import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Materias } from '../../../services/materia/materias';

@Component({
  selector: 'app-listarmaterias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarmaterias.html',
  styleUrl: './listarmaterias.css'
})
export class ListarMaterias implements OnInit, OnDestroy  {

  materias: any[] = [];
  cargando = true;

  private sub!: Subscription;

  constructor(private materiasService: Materias,
    private cdr: ChangeDetectorRef) { }

  //Detectar cambio
  async cargarMaterias() {
    this.cargando = true;
    this.materias = await this.materiasService.listarMaterias();
    this.cargando = false;
    this.cdr.detectChanges();
  }  

  //Cuando inicializa la pagina
  async ngOnInit() {
    await this.cargarMaterias();
    
    this.sub = this.materiasService.refrescar$.subscribe(() => {
      this.cargarMaterias();
    });
  }

  async eliminarMateria(id: string) { 
    await this.materiasService.eliminarMateria(id); 
  }

  editMateria(materia: any){
    this.materiasService.editarMateria(materia);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
