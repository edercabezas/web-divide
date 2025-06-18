import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client
  },
  {
    path: 'register',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },

  {
    path: 'dashboard/mis-grupos',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/chats',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/notification',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/mis-grupos',
    renderMode: RenderMode.Client
  },
   {
    path: 'dashboard/perfil',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/gasto/:expenseID',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { expenseID: '123' },
      { expenseID: '456' }
    ]
  },
  {
    path: 'dashboard/chats/:groupID',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { groupID: 'abc123' },
      { groupID: 'def456' }
    ]
  },
  {
    path: 'invitado/:token',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { token: 'abc123' },
      { token: 'def456' }
    ]
  }
];
