import { Routes } from '@angular/router';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';

export const routes: Routes = [
    { path: 'docs/:repo/:slug', component: DocViewerComponent }
];
