import type { Route } from '@angular/router';

export interface PrerenderRoute extends Route {
  getPrerenderParams?: () => Array<Record<string, string>>;
}
