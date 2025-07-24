import { Routes } from '@angular/router';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { IndexComponent } from './index/index.component';
import { LegalComponent } from './legal/legal.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: IndexComponent },
    { path: 'legal', component: LegalComponent },
    { path: 'docs/:repo/:slug', component: DocViewerComponent },
    { path: '**', redirectTo: '/', pathMatch: 'full' }
];
