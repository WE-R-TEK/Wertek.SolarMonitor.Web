import { Component, OnDestroy, OnInit } from '@angular/core';
import { PowerDataService } from '../../services/power-data.service';
import { Subscription, map } from 'rxjs';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-grandezas-eletrica',
  standalone: true,
  imports: [ CardModule, AccordionModule, CommonModule],
  templateUrl: './grandezas-eletrica.component.html',
  styleUrl: './grandezas-eletrica.component.less'
})
export class GrandezasEletricaComponent implements OnInit, OnDestroy{
  nowData: any = {};
  wsSubscription: Subscription;

  constructor(
    private powerDataService: PowerDataService,
    private readonly websocketService: Socket
  ) {
    this.wsSubscription = this.websocketService.fromEvent('events').pipe(map((receivedMessage: any) => {
      console.log('Received message from websocket: ', receivedMessage);
      this.retrieveData();
     })).subscribe();
  }
  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.retrieveData();
}

retrieveData() {
  this.powerDataService.getLastData().subscribe((data: any) => {
    this.nowData = data;
  });
}
}
