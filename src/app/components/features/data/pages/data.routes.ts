import { Routes } from '@angular/router';
import { DataPageComponent } from './data-page.component';

export const DATA_ROUTES: Routes = [

  { path: '', redirectTo: 'data', pathMatch: 'full' },
  { path: '', component: DataPageComponent },
];
