import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PowerDataService } from '../../services/power-data.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import moment from 'moment-timezone';
import 'chartjs-adapter-moment';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit, OnDestroy{
  consHoje = 0;
  gerHoje = 0;
  consMes = 0;
  gerMes = 0;
  sumData: any = {};
  sumDataMonth: any = {};
  chartPotenciaAtivaOpt: any = {};
  chartPotenciaAtivaData: any = {};
  chartCorrenteData: any = {};
  chartTensaoData: any = {};
  chartConsumoData: any = {};
  chartGeracaoData: any = {};

  constructor(
    private powerDataService: PowerDataService,
    private readonly websocketService: WebSocketService
  ) {}
  ngOnDestroy(): void {
    this.websocketService.disconnectSocket();
  }

  ngOnInit(): void {
    this.retrieveSumData();
    this.createCharts();
    this.websocketService.connectSocket('events');
    this.websocketService.receiveSocket().subscribe((receivedMessage: any) => {
      this.retrieveSumData();
      this.createCharts()
     });
  }

  retrieveSumData() {

    const startDay = moment.tz('America/Sao_Paulo').startOf('day').utc().toISOString();
    const endDay = moment.tz('America/Sao_Paulo').endOf('day').utc().toISOString();
    const startMonth = moment.tz('America/Sao_Paulo').startOf('month').utc().toISOString();
    const endMonth = moment.tz('America/Sao_Paulo').endOf('month').utc().toISOString();
    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_c').subscribe((data: any) => {
      this.consHoje = data;
    });
    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_g').subscribe((data: any) => {
      this.gerHoje = data;
    });
    this.powerDataService.getDifferenceDataPeriod(startMonth, endMonth, 'ept_c').subscribe((data: any) => {
      this.consMes = data;
    });
    this.powerDataService.getDifferenceDataPeriod(startMonth, endMonth, 'ept_g').subscribe((data: any) => {
      this.gerMes = data;
    });
  }

  createCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.chartPotenciaAtivaOpt = {
      animation: false,
      parsing: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      responsive: true,
      spanGaps: true,
      normalized: true,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          },
          decimation: {
            enabled: true,
            algorithm: 'lttb'
          }
      },
      scales: {
          x: {
            type: 'time',
            time: {
                unit: 'hour'
            }
          }
      }
    };
    const startDay = moment.tz('America/Sao_Paulo').startOf('day').utc().toISOString();
    const endDay = moment.tz('America/Sao_Paulo').utc().toISOString();
    this.powerDataService.getPotenciaAtivaData(startDay, endDay).subscribe((data: any) => {
      this.chartPotenciaAtivaData = {
        datasets: [
          {
            label: 'Fase A',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.pa ?? 0}}),
          },
          {
            label: 'Fase B',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.pb ?? 0}}),
          },
          {
            label: 'Fase C',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.pc ?? 0}}),
          },
          {
            label: 'Total',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.pt ?? 0}}),
          }
        ]
      }
    });
    this.powerDataService.getCorrenteData(startDay, endDay).subscribe((data: any) => {
      this.chartCorrenteData = {
        datasets: [
          {
            label: 'Fase A',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.iarms ?? 0}}),
          },
          {
            label: 'Fase B',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.ibrms ?? 0}}),
          },
          {
            label: 'Fase C',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.icrms ?? 0}}),
          },
          {
            label: 'Total',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.itrms ?? 0}}),
          }
        ]
      }
    });
    this.powerDataService.getTensaoData(startDay, endDay).subscribe((data: any) => {
      this.chartTensaoData = {
        datasets: [
          {
            label: 'Fase A',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.uarms ?? 0}}),
          },
          {
            label: 'Fase B',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.ubrms ?? 0}}),
          },
          {
            label: 'Fase C',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.ucrms ?? 0}}),
          }
        ]
      }
    });
    this.powerDataService.getConsumoData(startDay, endDay).subscribe((data: any) => {
      this.chartConsumoData = {
        datasets: [
          {
            label: 'Fase A',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epa_c ?? 0}}),
          },
          {
            label: 'Fase B',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epb_c ?? 0}}),
          },
          {
            label: 'Fase C',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epc_c ?? 0}}),
          },
          {
            label: 'Total',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.ept_c ?? 0}}),
          }
        ]
      }
    });
    this.powerDataService.getGeracaoData(startDay, endDay).subscribe((data: any) => {
      this.chartGeracaoData = {
        datasets: [
          {
            label: 'Fase A',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epa_g ?? 0}}),
          },
          {
            label: 'Fase B',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epb_g ?? 0}}),
          },
          {
            label: 'Fase C',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.epc_g ?? 0}}),
          },
          {
            label: 'Total',
            data: data.map((c: any) => {return {x: moment(c._time).valueOf(), y: c.ept_g ?? 0}}),
          }
        ]
      }
    });
  }
}
