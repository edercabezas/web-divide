import { Routes } from '@angular/router';
import { AuthGuard } from './divideYa/guards/auth.guard';
import GuestComponent from './divideYa/guest/guest.component';


export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./divideYa/auth/auth.routes.module').then(aut => aut.auth)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./divideYa/dashboard/dashboard.routes.module').then(data => data.dashboard),
  },
  {
    path: 'invitado/:token',
    component: GuestComponent
  }
];
