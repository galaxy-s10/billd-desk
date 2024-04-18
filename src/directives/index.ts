import { App } from 'vue';

import { directiveLoading } from './loading';

export default function registerDirectives(app: App) {
  app.directive('loading', directiveLoading);
}
