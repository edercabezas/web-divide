
import {Routes} from '@angular/router';


export const auth: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./login/login.component')
  },
  {
    path: 'register',
    loadComponent: () => import('./register/registerComponent')
  }
]
