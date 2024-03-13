import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-consumo-geracao',
  standalone: true,
  imports: [CalendarModule, ReactiveFormsModule, FormsModule, DropdownModule, HighchartsChartModule],
  templateUrl: './consumo-geracao.component.html',
  styleUrl: './consumo-geracao.component.less'
})
export class ConsumoGeracaoComponent implements OnInit {
  date: Date = new Date();
  maxDate: Date = new Date();
  periodos: any[] = [
    { label: 'Mensal', value: 'mensal' },
    { label: 'Anual', value: 'anual' }
  ];
  selectedPeriodo: any = 'mensal';
  Highcharts = Highcharts;
  chartConsumoOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.loadConsumoData();
  }

  loadConsumoData() {
    this.chartConsumoOptions = {
      title: {
        text: 'Consumo'
      },
      xAxis: {
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:%d/%m}'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Consumo',
          data: [{
            x: Date.UTC(2024, 0, 1),
            y: 100
          }, {
            x: Date.UTC(2024, 0, 2),
            y: 200
          }, {
            x: Date.UTC(2024, 0, 3),
            y: 300
          }, {
            x: Date.UTC(2024, 0, 4),
            y: 400
          }, {
            x: Date.UTC(2024, 0, 5),
            y: 500
          }, {
            x: Date.UTC(2024, 0, 6),
            y: 600
          }, {
            x: Date.UTC(2024, 0, 7),
            y: 700
          }, {
            x: Date.UTC(2024, 0, 8),
            y: 800
          }, {
            x: Date.UTC(2024, 0, 9),
            y: 900
          }, {
            x: Date.UTC(2024, 0, 10),
            y: 1000
          }, {
            x: Date.UTC(2024, 0, 11),
            y: 1100
          }, {
            x: Date.UTC(2024, 0, 12),
            y: 1200
          }, {
            x: Date.UTC(2024, 0, 13),
            y: 1300
          }, {
            x: Date.UTC(2024, 0, 14),
            y: 1400
          }, {
            x: Date.UTC(2024, 0, 15),
            y: 1500
          }, {
            x: Date.UTC(2024, 0, 16),
            y: 1600
          }, {
            x: Date.UTC(2024, 0, 17),
            y: 1700
          }, {
            x: Date.UTC(2024, 0, 18),
            y: 1800
          }, {
            x: Date.UTC(2024, 0, 19),
            y: 1900
          }, {
            x: Date.UTC(2024, 0, 20),
            y: 2000
          }, {
            x: Date.UTC(2024, 0, 21),
            y: 2100
          }, {
            x: Date.UTC(2024, 0, 22),
            y: 2200
          }, {
            x: Date.UTC(2024, 0, 23),
            y: 2300
          }, {
            x: Date.UTC(2024, 0, 24),
            y: 2400
          }, {
            x: Date.UTC(2024, 0, 25),
            y: 2500
          }, {
            x: Date.UTC(2024, 0, 26),
            y: 2600
          }, {
            x: Date.UTC(2024, 0, 27),
            y: 2700
          }, {
            x: Date.UTC(2024, 0, 28),
            y: 2800
          }, {
            x: Date.UTC(2024, 0, 29),
            y: 2900
          }, {
            x: Date.UTC(2024, 0, 30),
            y: 3000
          }, {
            x: Date.UTC(2024, 0, 31),
            y: 3100
          }]
        }
      ]
    };
  }
}
