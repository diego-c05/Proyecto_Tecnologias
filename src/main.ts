import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { setLogLevel, LogLevel } from '@angular/fire';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

setLogLevel(LogLevel.SILENT);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch((err) => console.error(err));