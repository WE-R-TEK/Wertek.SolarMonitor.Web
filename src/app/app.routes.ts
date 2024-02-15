import { Routes } from '@angular/router';
import { GrandezasEletricaComponent } from './pages/grandezas-eletrica/grandezas-eletrica.component';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './layout/app.layout/app.layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { userLoggedInGuard } from './services/guards/user-logged-in.guard';
import { userNotLoggedInGuard } from './services/guards/user-not-logged-in.guard';

export const routes: Routes = [
  { path: '', component: AppLayoutComponent, canActivate: [userLoggedInGuard], children: [
    { path: '', component: DashboardComponent },
    { path: 'home', component: HomeComponent},
    { path: 'grandezas-eletricas', component: GrandezasEletricaComponent },
  ] },
  { path: 'login', component: LoginComponent, canActivate: [userNotLoggedInGuard]}
];
