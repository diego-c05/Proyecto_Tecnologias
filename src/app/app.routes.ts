import { Routes } from '@angular/router';
import { ReporteEventos } from './paginas/admin/reporte-eventos/reporte-eventos';
import { ReporteHoras } from './paginas/admin/reporte-horas/reporte-horas';


export const routes: Routes = [
  { path: '', redirectTo: 'admin/reporte-eventos', pathMatch: 'full' },

  { path: 'admin/reporte-eventos', component: ReporteEventos },
  { path: 'admin/reporte-horas', component: ReporteHoras },

];
