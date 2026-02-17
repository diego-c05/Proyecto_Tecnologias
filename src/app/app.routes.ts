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
import { EventsForm} from './paginas/eventos/events-form/events-form';
import { GestionUsuarios } from './paginas/admin/gestion-usuarios/gestion-usuarios';
import { MateriasPagina } from './paginas/materias/materias-pagina/materias-pagina';
import { MisInscripcionesComponent } from './paginas/inscripciones/mis-inscripciones/mis-inscripciones';
import { AdminInscripcionesComponent } from './paginas/inscripciones/admi-inscripciones/admi-inscripciones';



export const routes: Routes = [
  { path: '', redirectTo: 'inicio-sesion', pathMatch: 'full' },
  {
    path: '', component: Navegacion,
    children: [{ path: 'admin/reporte-eventos', component: ReporteEventos },
    { path: 'admin/reporte-horas', component: ReporteHoras },
    { path: 'admin/gestion-usuarios', component: GestionUsuarios },
    { path: 'eventos/vereventos', component: Vereventos },
      { path: 'eventos/detalle-events/:id', component: DetalleEvents  },

      { path: 'eventos/events-list', component: EventsList },
 { path: 'eventos/crear', component: EventsForm },
      { path: 'eventos/editar/:id', component: EventsForm },

    { path: 'historial-horas', component: HistorialHoras },
    { path: 'eventos/detalle-events/:id', component: DetalleEvents  },
     { path: 'mis-inscripciones', component: MisInscripcionesComponent },
{ path: 'inscripciones/admi-inscripciones', component: AdminInscripcionesComponent },

    { path: 'historial-horas', component: HistorialHoras },
    { path: 'materias/materias-pagina', component: MateriasPagina },
    ]
  },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'registro', component: RegistroComponent },
];
