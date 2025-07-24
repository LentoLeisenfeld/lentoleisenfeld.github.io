import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return '/assets/monaco/min/vs/language/typescript/tsWorker.js';
    }
    if (label === 'json') {
      return '/assets/monaco/min/vs/language/json/jsonWorker.js';
    }
    if (label === 'css') {
      return '/assets/monaco/min/vs/language/css/cssWorker.js';
    }
    if (label === 'html') {
      return '/assets/monaco/min/vs/language/html/htmlWorker.js';
    }
    return '/assets/monaco/min/vs/editor/editor.worker.js';
  }
};

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
