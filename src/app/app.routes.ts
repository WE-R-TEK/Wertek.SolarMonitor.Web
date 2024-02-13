import { Routes } from '@angular/router';
import { GrandezasEletricaComponent } from './pages/grandezas-eletrica/grandezas-eletrica.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'grandezas-eletricas', component: GrandezasEletricaComponent },
];
