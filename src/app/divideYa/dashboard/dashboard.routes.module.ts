
import {Routes} from '@angular/router';
import DashboardComponent from './dashboard/dashboard.component';
import MyGroupComponent from './group/my-group/my-group.component';
import HomeComponent from './home/home.component';
import ListChatsComponent from './message/list-chats/list-chats.component';
import ChatComponent from './message/chat/chat.component';
import ListExpensesComponent from './expenses/list-expenses/list-expenses.component';
import { ProfileComponent } from './profile/profile.component';


export const dashboard: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        title: 'Panel de Administración',
        component: HomeComponent
      },
      {
        path: 'mis-grupos',
        title: 'Grupos',
        component: MyGroupComponent
      },
      {
        path: 'chats',
        title: 'Chat',
        component: ListChatsComponent
      },
      {
        path: 'chat/:groupID',
        title: 'Chat',
        component: ChatComponent
      },
      {
        path: 'gasto/:expenseID',
        title: 'Gastos',
        component: ListExpensesComponent
      },
      {
        path: 'perfil',
        component: ProfileComponent
      }
    ]
  },
  
]
