import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { AngularFireAuthModule, PERSISTENCE } from '@angular/fire/compat/auth';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideAuth(() => getAuth())),
    provideAnimations(),
    provideHttpClient(),
    {provide: LOCALE_ID, useValue: 'pt' },
    {provide: PERSISTENCE, useValue: 'session'}
  ]
};
