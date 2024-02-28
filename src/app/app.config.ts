import { ApplicationConfig, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
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
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { provideServiceWorker } from '@angular/service-worker';

registerLocaleData(localePt);

const socketConfig: SocketIoConfig = { url: 'https://api-power.we-rtek.com', options: {}};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
    provideAnimations(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: PERSISTENCE, useValue: 'session' },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
