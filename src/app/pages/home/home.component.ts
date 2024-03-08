import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PowerDataService } from '../../services/power-data.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import moment from 'moment-timezone';
import 'chartjs-adapter-moment';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Socket } from 'ngx-socket-io';
import { Subscription, map } from 'rxjs';
import { ResumoConsumoComponent } from '../../components/resumo-consumo/resumo-consumo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule, CalendarModule, FormsModule, HighchartsChartModule, ResumoConsumoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit, OnDestroy{
  maxDate = new Date();
  private _date: Date = new Date();
  Highcharts = Highcharts;
  chartPotenciaAtivaOptions: Highcharts.Options = {};
  chartCorrenteOptions: Highcharts.Options = {};
  chartTensaoOptions: Highcharts.Options = {};
  chartConsumoOptions: Highcharts.Options = {};
  chartInjetadoOptions: Highcharts.Options = {};
  chartGeracaoOptions: Highcharts.Options = {};
  chartGeracaoPerOptions: Highcharts.Options = {};
  wsSubscription: Subscription;

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
    this.updateData();
  }

  constructor(
    private powerDataService: PowerDataService,
    private readonly websocketService: Socket
  ) {
    this.wsSubscription = this.websocketService.fromEvent('events').pipe(map((receivedMessage: any) => {
      console.log('Received message from websocket: ', receivedMessage);
      this.updateData();
     })).subscribe();
  }
  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.updateData();

  }

  updateData() {
    this.retrieveConsumoData();
    this.retrieveInjetadaData();
    this.retrievePotenciaAtivaData();
    this.retrieveCorrenteData();
    this.retrieveTensaoData();
    this.retrieveGeracaoData();
    this.retrieveGeracaoPerData();
  }

  retrievePotenciaAtivaData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
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
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
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
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
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
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
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

  retrieveInjetadaData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
    this.powerDataService.getInjetadaData(startDay, endDay).subscribe((data: any) => {
      this.chartInjetadoOptions = this.powerDataService.getChartLineOptions('Energia Injetada (Geração) [kWh]', 'kWh', [
          {title: 'Fase A', color: 'darkblue', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epa_g])},
          {title: 'Fase B', color: 'darkgreen', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epb_g])},
          {title: 'Fase C', color: 'darkred', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.epc_g])},
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.ept_g])},
        ]
      );
    });
  }

  retrieveGeracaoData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
    this.powerDataService.getGeracaoData(startDay, endDay).subscribe((data: any) => {
      console.log('Geracao Data: ', data);
      this.chartGeracaoOptions = this.powerDataService.getChartLineOptions('Energia Gerada [kWh]', 'kWh', [
          {title: 'Total', color: 'black', values: data.map((d: any) => [moment.utc(d._time).valueOf(), d.total])},
        ]
      );
    });
  }

  retrieveGeracaoPerData() {
    const startDay = moment(this._date).startOf('day').utc().toISOString();
    let endDay = moment(this._date).endOf('day').utc().toISOString();
    const today = new Date();
    if(this._date.getFullYear() === today.getFullYear() && this._date.getMonth() === today.getMonth() && this._date.getDate() === today.getDate())
      endDay = moment().utc().toISOString();
    this.powerDataService.getGeracaoPerData(startDay, endDay).subscribe((data: any) => {
      this.chartGeracaoPerOptions = this.powerDataService.getChartAreaOptions('Energia Gerada por Período [kWh]', 'kWh', 'darkblue', data.map((d: any) => [moment.utc(d._time).valueOf(), d.ger_per]));
    });
  }
}
