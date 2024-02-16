import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../services/api/product';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../../services/app.layout.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { WebSocketService } from '../../services/web-socket.service';
import moment from 'moment';
import { PowerDataService } from '../../services/power-data.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, MenuModule, ChartModule, HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit, OnDestroy {
  consHoje = 0;
  gerHoje = 0;
  consMes = 0;
  gerMes = 0;
  Highcharts = Highcharts;
  chartPotenciaAOptions: Highcharts.Options = {};
  chartPotenciaBOptions: Highcharts.Options = {};
  chartPotenciaCOptions: Highcharts.Options = {};
  chartPotenciaTOptions: Highcharts.Options = {};
  chartCorrenteAOptions: Highcharts.Options = {};
  chartCorrenteBOptions: Highcharts.Options = {};
  chartCorrenteCOptions: Highcharts.Options = {};
  chartCorrenteTOptions: Highcharts.Options = {};
  chartTensaoAOptions: Highcharts.Options = {};
  chartTensaoBOptions: Highcharts.Options = {};
  chartTensaoCOptions: Highcharts.Options = {};
  chartConsumoOptions: Highcharts.Options = {};
  chartGeracaoOptions: Highcharts.Options = {};

  items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
      public layoutService: LayoutService,
      private readonly websocketService: WebSocketService,
      private readonly powerDataService: PowerDataService
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
        });
    }

    ngOnInit() {
      this.websocketService.connectSocket('events');
      this.retrieveSumData();
      this.retieveNowData();
      this.retrieveConsumoData();
      this.retrieveGeracaoData();
      this.websocketService.receiveSocket().subscribe((receivedMessage: any) => {
        this.retrieveSumData();
        this.retieveNowData();
        this.retrieveConsumoData();
        this.retrieveGeracaoData();
      });
    }

    retrieveConsumoData() {
      const startDay = moment.tz('America/Sao_Paulo').startOf('day').utc().toISOString();
      const endDay = moment.tz('America/Sao_Paulo').utc().toISOString();
      this.powerDataService.getConsumoData(startDay, endDay).subscribe((data: any) => {
        this.chartConsumoOptions = this.powerDataService.getChartAreaOptions('Consumo de Energia [kWh]', 'kWh', 'darkred', data.map((d: any) => [moment.utc(d._time).valueOf(), d.ept_c]));
      });
    }

    retrieveGeracaoData() {
      const startDay = moment.tz('America/Sao_Paulo').startOf('day').utc().toISOString();
      const endDay = moment.tz('America/Sao_Paulo').utc().toISOString();
      this.powerDataService.getGeracaoData(startDay, endDay).subscribe((data: any) => {
        this.chartGeracaoOptions = this.powerDataService.getChartAreaOptions('Geração de Energia [kWh]', 'kWh', 'darkgreen', data.map((d: any) => [moment.utc(d._time).valueOf(), d.ept_g]));
      });
    }

    retieveNowData() {
      this.powerDataService.getLastData().subscribe((data: any) => {
        this.chartPotenciaAOptions = this.powerDataService.getGaugeOptions('Potência A', 'W', -2000, 2000, data.pa);
        this.chartPotenciaBOptions = this.powerDataService.getGaugeOptions('Potência B', 'W', -2000, 2000, data.pb);
        this.chartPotenciaCOptions = this.powerDataService.getGaugeOptions('Potência C', 'W', -2000, 2000, data.pc);
        this.chartPotenciaTOptions = this.powerDataService.getGaugeOptions('Potência Total', 'W', -3000, 3000, data.pt);
        this.chartCorrenteAOptions = this.powerDataService.getGaugeOptions('Corrente A', 'A', 0, 100, data.iarms);
        this.chartCorrenteBOptions = this.powerDataService.getGaugeOptions('Corrente B', 'A', 0, 100, data.ibrms);
        this.chartCorrenteCOptions = this.powerDataService.getGaugeOptions('Corrente C', 'A', 0, 100, data.icrms);
        this.chartCorrenteTOptions = this.powerDataService.getGaugeOptions('Corrente Total', 'A', 0, 100, data.itrms);
        this.chartTensaoAOptions = this.powerDataService.getGaugeOptions('Tensão A', 'V', 0, 300, data.uarms);
        this.chartTensaoBOptions = this.powerDataService.getGaugeOptions('Tensão B', 'V', 0, 300, data.ubrms);
        this.chartTensaoCOptions = this.powerDataService.getGaugeOptions('Tensão C', 'V', 0, 300, data.ucrms);
      })
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

    ngOnDestroy() {
        this.websocketService.disconnectSocket();
    }
}
