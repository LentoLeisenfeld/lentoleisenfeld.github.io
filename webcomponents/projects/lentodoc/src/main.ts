import { bootstrapApplication } from '@angular/platform-browser';
import { LentoDocComponent } from './lib/lentodoc.component';
import { createCustomElement } from '@angular/elements';

bootstrapApplication(LentoDocComponent)
  .then(appRef => {
    const injector = appRef.injector;
    const el = createCustomElement(LentoDocComponent, { injector });
    customElements.define('lento-doc', el);
  });