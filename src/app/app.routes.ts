import { Routes } from '@angular/router';
import { GrandezasEletricaComponent } from './pages/grandezas-eletrica/grandezas-eletrica.component';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './layout/app.layout/app.layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { PowerInvoiceSimulatorComponent } from './pages/power-invoice-simulator/power-invoice-simulator.component';
import { ConsumoGeracaoComponent } from './pages/consumo-geracao/consumo-geracao.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  { path: '', component: AppLayoutComponent, canActivate: [AuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}, children: [
    { path: '', component: DashboardComponent },
    { path: 'home', component: HomeComponent},
    { path: 'consumo-geracao', component: ConsumoGeracaoComponent},
    { path: 'grandezas-eletricas', component: GrandezasEletricaComponent },
    { path: 'user-settings', component: UserSettingsComponent },
    { path: 'power-invoice-simulator', component: PowerInvoiceSimulatorComponent }
  ] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: {authGuardPipe: redirectLoggedInToHome} },
];
