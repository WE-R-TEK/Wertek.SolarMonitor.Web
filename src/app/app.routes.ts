import { Routes } from '@angular/router';
import { GrandezasEletricaComponent } from './pages/grandezas-eletrica/grandezas-eletrica.component';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './layout/app.layout/app.layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: AppLayoutComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'home', component: HomeComponent},
    { path: 'grandezas-eletricas', component: GrandezasEletricaComponent },
  ] },
];
