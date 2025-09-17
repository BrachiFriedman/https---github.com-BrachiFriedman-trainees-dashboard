import { Routes } from '@angular/router';
import { AnalysisPageComponent } from './analysis-page.component';

export const ANALYSIS_ROUTES: Routes = [

  { path: '/analysis', redirectTo: 'analysis', pathMatch: 'full' },
  { path: '', component: AnalysisPageComponent },
];
