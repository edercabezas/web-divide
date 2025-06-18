
import { Routes } from '@angular/router';
import DashboardComponent from './dashboard/dashboard.component';
import MyGroupComponent from './group/my-group/my-group.component';
import HomeComponent from './home/home.component';
import ListChatsComponent from './message/list-chats/list-chats.component';
import ChatComponent from './message/chat/chat.component';
import ListExpensesComponent from './expenses/list-expenses/list-expenses.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationComponent } from './notification/notification.component';
import { RewardComponent } from './reward/reward.component';
import { StatisticsComponent } from './statistics/statistics.component';


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
        path: 'chats/:groupID',
        title: 'Chat',
        component: ListChatsComponent,
        data: {
          prerender: false,
          renderMode: 'client'
        }
      },
      {
        path: 'gasto/:expenseID',
        title: 'Gastos',
        component: ListExpensesComponent,
        data: {
          prerender: false,
          renderMode: 'client'
        }
      },
      {
        path: 'perfil',
        component: ProfileComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'recompensa',
        component: RewardComponent
      },
      {
        path: 'estadistica',
        component: StatisticsComponent
      }
    ]
  },

]
