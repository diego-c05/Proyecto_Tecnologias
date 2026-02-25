import { Routes } from '@angular/router';
import { Vereventos } from './paginas/eventos/vereventos/vereventos';
import { DetalleEvents } from './paginas/eventos/detalle-events/detalle-events';
import { ReporteEventos } from './paginas/admin/reporte-eventos/reporte-eventos';
import { ReporteHoras } from './paginas/admin/reporte-horas/reporte-horas';
import { InicioSesionComponent } from './auth/inicio-sesion/inicio-sesion';
import { RegistroComponent } from './auth/registro/registro';
import { HistorialHoras } from './paginas/historial-horas/historial-horas';
import { Navegacion } from './paginas/navegacion/navegacion';
import { EventsList } from './paginas/eventos/events-list/events-list';
import { EventsForm } from './paginas/eventos/events-form/events-form';
import { GestionUsuarios } from './paginas/admin/gestion-usuarios/gestion-usuarios';
import { MateriasPagina } from './paginas/materias/materias-pagina/materias-pagina';
import { MisInscripcionesComponent } from './paginas/inscripciones/mis-inscripciones/mis-inscripciones';
import { AdminInscripcionesComponent } from './paginas/inscripciones/admi-inscripciones/admi-inscripciones';
import { authGuard } from './guards/auth.guard';
import { coordinadorGuard } from './guards/coordinador.guard';



export const routes: Routes = [


  { path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: '', 
    component: Navegacion,
    canActivate: [authGuard],
    children: [
      { path: 'eventos/vereventos', component: Vereventos },
      { path: 'historial-horas', component: HistorialHoras },
      { path: 'eventos/detalle-events/:id', component: DetalleEvents },
      { path: 'mis-inscripciones', component: MisInscripcionesComponent },


      { path: 'admin/reporte-eventos', component: ReporteEventos, canActivate: [coordinadorGuard]},
      { path: 'admin/reporte-horas', component: ReporteHoras, canActivate: [coordinadorGuard] },
      { path: 'admin/gestion-usuarios', component: GestionUsuarios, canActivate: [coordinadorGuard] },
      
      { path: 'eventos/events-list', component: EventsList, canActivate: [coordinadorGuard] },
      { path: 'eventos/crear', component: EventsForm, canActivate: [coordinadorGuard] },
      { path: 'eventos/editar/:id', component: EventsForm, canActivate: [coordinadorGuard] },

      { path: 'inscripciones/admi-inscripciones', component: AdminInscripcionesComponent, canActivate: [coordinadorGuard] },

      { path: 'materias/materias-pagina', component: MateriasPagina, canActivate: [coordinadorGuard] },
    ]
  },
  { path: '**', redirectTo: 'inicio-sesion' }
  
];
