import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Socket } from 'ngx-socket-io';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewVersionCheckerService {
  isNewVersionAvailable: boolean = false;
  intervalSource = interval(15 * 60 * 1000);
  intervalSubscription: Subscription | undefined;

  constructor(
    private swUpdate: SwUpdate,
    private zone: NgZone,
    private readonly websocket: Socket,
  ) {
    console.log('NewVersionCheckerService created');
    this.checkForUpdates();
    document.onvisibilitychange = () => {
      if (!document.hidden) {
        this.websocket.connect();
        this.websocket.emit('events', 'reload');
      }
    }
  }

  checkForUpdates(): void {
    this.intervalSubscription?.unsubscribe();
    if (!this.swUpdate.isEnabled) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.intervalSubscription = this.intervalSource.subscribe(async () => {
        try {
          this.isNewVersionAvailable = await this.swUpdate.checkForUpdate();
          console.log(this.isNewVersionAvailable ? 'A new version is available.' : 'Already on the latest version.');
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      });
    })
  }

  applyUpdate(): void {
    this.swUpdate.activateUpdate()
      .then(() => document.location.reload())
      .catch(err => console.error('Failed to apply updates:', err));
  }
}
