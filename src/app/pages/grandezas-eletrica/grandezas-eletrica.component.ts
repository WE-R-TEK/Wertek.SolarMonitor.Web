import { Component, OnDestroy, OnInit } from '@angular/core';
import { PowerDataService } from '../../services/power-data.service';
import { map } from 'rxjs';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-grandezas-eletrica',
  standalone: true,
  imports: [ CardModule, AccordionModule, CommonModule],
  templateUrl: './grandezas-eletrica.component.html',
  styleUrl: './grandezas-eletrica.component.less'
})
export class GrandezasEletricaComponent implements OnInit, OnDestroy{
  nowData: any = {};

  constructor(
    private powerDataService: PowerDataService,
    private readonly websocketService: WebSocketService
  ) {}
  ngOnDestroy(): void {
    this.websocketService.disconnectSocket();
  }

  ngOnInit(): void {
    this.retrieveData();
    this.websocketService.connectSocket('events');
    this.websocketService.receiveSocket().subscribe((receivedMessage: any) => {
      this.retrieveData();
     });
}

retrieveData() {
  this.powerDataService.getLastData().subscribe((data: any) => {
    this.nowData = data;
  });
}
}
