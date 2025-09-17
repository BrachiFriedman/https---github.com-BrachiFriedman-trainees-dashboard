import { Routes } from '@angular/router';
import { MonitorPageComponent } from './components/features/monitor/pages/monitor-page.component';
import { AnalysisPageComponent } from './components/features/analysis/pages/analysis-page.component';
import { DataPageComponent } from './components/features/data/pages/data-page.component';

export const routes: Routes = [
    {
        path: 'data',
        component:DataPageComponent,
        children: [
          { path: 'monitor',component:AnalysisPageComponent },      
          { path: 'analysis',component:AnalysisPageComponent },      
        ]
      },
      {
        path: 'analysis',
        component:AnalysisPageComponent
      },
      {
        path: 'monitor',
        component:MonitorPageComponent
      },
      { path: '', redirectTo: 'data', pathMatch: 'full' },
];
