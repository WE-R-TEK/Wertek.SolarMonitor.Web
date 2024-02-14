import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../services/api/product';
import { Subscription, debounceTime } from 'rxjs';
import { ProductService } from '../../services/product.service';
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

  items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
      private productService: ProductService,
      public layoutService: LayoutService,
      private readonly websocketService: WebSocketService,
      private readonly powerDataService: PowerDataService
    ) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
      this.websocketService.connectSocket('events');
      this.retrieveSumData();
      this.retieveNowData();
      this.websocketService.receiveSocket().subscribe((receivedMessage: any) => {
        this.retrieveSumData();
      });
    }

    retieveNowData() {
      this.powerDataService.getLastData().subscribe((data: any) => {
        console.log('here', data);
        this.chartPotenciaAOptions = this.powerDataService.getGaugeOptions('Potência A', 'W', -2000, 2000, data.pa);
        this.chartPotenciaBOptions = this.powerDataService.getGaugeOptions('Potência B', 'W', -2000, 2000, data.pb);
        this.chartPotenciaCOptions = this.powerDataService.getGaugeOptions('Potência C', 'W', -2000, 2000, data.pc);
        this.chartPotenciaTOptions = this.powerDataService.getGaugeOptions('Potência Total', 'W', -2000, 2000, data.pt);

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

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.websocketService.disconnectSocket();
    }
}
