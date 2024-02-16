import { Routes } from '@angular/router';
import { GrandezasEletricaComponent } from './pages/grandezas-eletrica/grandezas-eletrica.component';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './layout/app.layout/app.layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  { path: '', component: AppLayoutComponent, canActivate: [AuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}, children: [
    { path: '', component: DashboardComponent },
    { path: 'home', component: HomeComponent},
    { path: 'grandezas-eletricas', component: GrandezasEletricaComponent },
  ] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: {authGuardPipe: redirectLoggedInToHome} },
];
