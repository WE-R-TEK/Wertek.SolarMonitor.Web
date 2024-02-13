import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = new Socket({
      url: 'http://52.40.160.15:3000',
      options: {}
    });
  }

  connectSocket(message: string) {
    this.socket.emit('events', message);
  }

  receiveSocket() {
    return this.socket.fromEvent('events');
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
