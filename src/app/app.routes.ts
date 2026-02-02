import { Routes } from '@angular/router';
import { Vereventos } from './paginas/eventos/vereventos/vereventos';
import { ReporteEventos } from './paginas/admin/reporte-eventos/reporte-eventos';
import { ReporteHoras } from './paginas/admin/reporte-horas/reporte-horas';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { Registro } from './auth/registro/registro';
import { HistorialHoras } from './paginas/historial-horas/historial-horas';
import { Navegacion } from './paginas/navegacion/navegacion';


export const routes: Routes = [
  { path: '', redirectTo: 'admin/reporte-eventos', pathMatch: 'full' },
  {
    path: '', component: Navegacion,
    children: [{ path: 'admin/reporte-eventos', component: ReporteEventos },
    { path: 'admin/reporte-horas', component: ReporteHoras },
    { path: 'eventos/vereventos', component: Vereventos },
    { path: 'historial-horas', component: HistorialHoras },]
  },
  { path: 'inicio-sesion', component: InicioSesion },
  { path: 'registro', component: Registro },
];
