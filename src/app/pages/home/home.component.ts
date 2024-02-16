import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PowerDataService } from '../../services/power-data.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import moment from 'moment-timezone';
import 'chartjs-adapter-moment';
import { WebSocketService } from '../../services/web-socket.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule, CalendarModule, FormsModule, HighchartsChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit, OnDestroy{
  consHoje = 0;
  gerHoje = 0;
  consMes = 0;
  gerMes = 0;
  private _date: Date = new Date();
  Highcharts = Highcharts;
  chartPotenciaAtivaOptions: Highcharts.Options = {};
  chartCorrenteOptions: Highcharts.Options = {};
  chartTensaoOptions: Highcharts.Options = {};
  chartConsumoOptions: Highcharts.Options = {};
  chartGeracaoOptions: Highcharts.Options = {};

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
    this.updateData();
  }

  constructor(
    private powerDataService: PowerDataService,
    private readonly websocketService: WebSocketService
  ) {}
  ngOnDestroy(): void {
    this.websocketService.disconnectSocket();
  }

  ngOnInit(): void {
    this.updateData();
    this.websocketService.connectSocket('events');
    this.websocketService.receiveSocket().subscribe((receivedMessage: any) => {
      this.updateData();
     });
  }

  updateData() {
    this.retrieveSumData();
    this.retrieveConsumoData();
    this.retrieveGeracaoData();
    this.retrievePotenciaAtivaData();
    this.retrieveCorrenteData();
    this.retrieveTensaoData();
  }

  retrievePotenciaAtivaData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    this.powerDataService.getPotenciaAtivaData(startDay, endDay).subscribe((data: any) => {
      this.chartPotenciaAtivaOptions = this.powerDataService.getChartLineOptions('Potência Ativa [kW]', 'kW', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.pa])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.pb])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.pc])},
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.pt])},
        ]
      );
    });
  }

  retrieveCorrenteData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    this.powerDataService.getCorrenteData(startDay, endDay).subscribe((data: any) => {
      this.chartCorrenteOptions = this.powerDataService.getChartLineOptions('Corrente [A]', 'A', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.iarms])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ibrms])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.icrms])},
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.itrms])},
        ]
      );
    });
  }

  retrieveTensaoData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    this.powerDataService.getTensaoData(startDay, endDay).subscribe((data: any) => {
      this.chartTensaoOptions = this.powerDataService.getChartLineOptions('Tensão [V]', 'V', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.uarms])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ubrms])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ucrms])},
        ]
      );
    });
  }

  retrieveConsumoData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    this.powerDataService.getConsumoData(startDay, endDay).subscribe((data: any) => {
      this.chartConsumoOptions = this.powerDataService.getChartLineOptions('Consumo de Energia [kWh]', 'kWh', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epa_c])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epb_c])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epc_c])},
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ept_c])},
        ]
      );
    });
  }

  retrieveGeracaoData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    this.powerDataService.getGeracaoData(startDay, endDay).subscribe((data: any) => {
      this.chartGeracaoOptions = this.powerDataService.getChartLineOptions('Geração de Energia [kWh]', 'kWh', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epa_g])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epb_g])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epc_g])},
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ept_g])},
        ]
      );
    });
  }

  retrieveSumData() {

    const startDay = moment(this._date).startOf('day').utc().toISOString();
    const endDay = moment(this._date).endOf('day').utc().toISOString();
    const startMonth = moment(this._date).startOf('month').utc().toISOString();
    const endMonth = moment(this._date).endOf('month').utc().toISOString();
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
}
