import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { LentoDocComponent } from './components/lentodoc.component';

bootstrapApplication(LentoDocComponent)
  .then(ref => {
    const injector = ref.injector;
    const el = createCustomElement(LentoDocComponent, { injector });
    customElements.define('openapi-viewer', el);
  });