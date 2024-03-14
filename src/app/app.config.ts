import { ApplicationConfig, ErrorHandler, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { provideServiceWorker } from '@angular/service-worker';
import { LoadChunkErrorHandler } from './services/load-chunk-error.handler';
import { DialogService } from 'primeng/dynamicdialog';

registerLocaleData(localePt);

const socketConfig: SocketIoConfig = { url: 'https://api-power.we-rtek.com', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: LoadChunkErrorHandler },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
    importProvidersFrom(DialogService),
    { provide: DialogService, useClass: DialogService },
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
